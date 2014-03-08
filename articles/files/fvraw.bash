#! /bin/bash

# Copyright (C) 2010 Francisco Javier Vázquez Púa
#
# Fvraw is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# Fvraw is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with Fvraw.  If not, see <http://www.gnu.org/licenses/>.

# Version: 0.1

# Directorio donde se generaran los ficheros temporales
temp_path=/tmp

# Valores por defecto de exposicion
min_ev="0"
max_ev="0"
ev_space="1"

# Valores por defecto de saturacion
saturacion_s=14745; #Valor limite
saturacion_r=4096;  #Valor limite

# Valores para la ejecución de enfuse
exposure_weight=1.0
saturation_weight=0.2
contrast_weight=0
wavelet_denoising=500
highlight_mode_s=0
highlight_mode_r=0

# Modo zenity
zenity_mode=0

# Borrado de ficheros temporales
remove_tmp=1
 
# Esta función imprime por pantalla la ayuda del programa
print_help ()
{
    echo 'HDR raw photo decoder "fvraw" v0.1'
    echo 'by Francisco Vazquez, fjvp a digital-cylcops o com'
    echo 'Usage:  fvraw [options] FILE...'
    echo 
    echo 'Opciones:'
    echo ' -n --min-ev MIN_EV        Default: 0'     
    echo ' -x --max-ev MAX_EV        Default: 0'
    echo ' -c --spc-ev SPC_EV        Default: 1'
    echo ' -s --max-s  MAX_S         [0, 16383] Default: 14745'
    echo ' -r --max-r  MAX_R         [0, 16383] Default: 4096'
    echo ' -E --exposure-weight      [0, 1]     Default: 1.0'
    echo ' -S --saturation-weight    [0, 1]     Default: 0.2'
    echo ' -C --contrast-weight      [0, 1]     Default: 0.0'
    echo ' -d --wavelet-denoising    [0, 1000]  Default: 500'
    echo ' -H --highlight-mode-s     [0, 9]     Default: 0'
    echo ' -p --highlight-mode-r     [0, 9]     Default: 0'
    echo ' -z --zenity-mode'
    echo ' -T --no-remove-tmp'

}

# Esta funcion revelara el raw que esta en la variable file_raw
revelar_raw ()
{

    # Parametros para dcraw y enfuse
    dcraw_params_s="-v -T -w -s 0 -S $saturacion_s \
                    -H $highlight_mode_s" 
    dcraw_params_r="-v -T -w -s 1 -S $saturacion_r \
                    -H $highlight_mode_r -n $wavelet_denoising"

    enfuse_params="--wExposure=$exposure_weight \
                   --wSaturation=$saturation_weight \
                   --wContrast=$contrast_weight"

    # Nombre del fichero
    base_raw="${file_raw%.*}"

    # Cadena con la cual identifica dcraw los raw de la S5
    id_s5_pro="$file_raw is a FUJIFILM FinePix S5Pro image."
    id_string=`dcraw -i $file_raw 2> /dev/null`

    # Si el fichero es un raw de la S5
    if [ "$id_string" = "$id_s5_pro" ]; then

	# Comienzo del proceso
	echo
	echo "==========================================================="
	echo -e "fvraw: \033[1;33m$file_raw\033[0m"
	echo "==========================================================="
	
	if [ $zenity_mode = 1 ]; then
	    echo "#Revelando: $file_raw"
	fi

	# Variable con los nombre de los ficheros
	file_out="$base_raw.tiff"
	
	# Revelado con dcraw 
	echo -e "\033[0;34mRevelando con dcraw:\033[0m"
	echo "dcraw -c $dcraw_params_r $file_raw > $file_r"
	file_r="$temp_path/${base_raw}_r.tiff"
	dcraw -c $dcraw_params_r $file_raw > $file_r

	files_s=""
	for i in `seq $min_ev $ev_space $max_ev`; do
	    file_s="$temp_path/${base_raw}_s_$i.tiff"
	    files_s="$files_s $file_s"
	    bright_value=`echo -e "scale=3\n2^$i" | bc -l`
            echo "dcraw -c $dcraw_params_s -b $bright_value $file_raw > $file_s"
            dcraw -c $dcraw_params_s -b $bright_value $file_raw > $file_s
	done

	# Fusionado con enfuse
	if [ $zenity_mode = 1 ]; then
	    echo "#Fusionando con enfuse: $file_raw"
	fi

	echo -e "\033[0;34mFusionando con enfuse:\033[0m"
	echo "enfuse $enfuse_params $files_s $file_r -o $file_out"
	enfuse $enfuse_params $files_s $file_r -o $file_out
	
	# Limpiando ficheros intermedios
	if [ $remove_tmp = 1 ]; then
	    
	    if [ $zenity_mode = 1 ]; then
		echo "#Borrado de ficheros temporales: $file_raw"
	    fi

	    echo -e "\033[0;34mEliminando ficheros temporales:\033[0m"
	    echo "rm $files_s $file_r"
	    rm $files_s $file_r
	    
	fi

    else
	echo "File error:  $file_raw is not a valid RAW S5 Pro"
	exit 1
    fi
} 


# Comprueba que el programa contenido en la variable "program_to_check"
# está disponible en PATH
check_program ()
{
    type -P $program_to_check &>/dev/null || \
    { echo "No se ha encontrado \"$program_to_check\" en la variable PATH." >&2
      echo "Instalelo o incluyalo en ella" >&2
      exit 1; }
}

# Lo primero será comprobar la existencia de dcraw
program_to_check=dcraw
check_program
program_to_check=enfuse
check_program

# Note that we use `"$@"' to let each command-line parameter expand to a 
# separate word. The quotes around `$@' are essential!
# We need TEMP as the `eval set --' would nuke the return value of getopt.
TEMP=`getopt -o n:x:c:s:r:E:S:C:d:H:p:zT --long min-ev:,max-ev:,spc-ev:,max-s:,\
max-r:,exposure-weight:,saturation-weight:,contrast-weight:,wavelet-denoising:,\
highlight-mode-s:,highlight-mode-r:,zenity-mode,no-remove-tmp -n 'fvraw.sh' -- "$@"`

# Si el valor retornado muestra error
if [ $? != 0 ] ; then echo "Terminating..." >&2 ; exit 1 ; fi

# Note the quotes around `$TEMP': they are essential!
eval set -- "$TEMP"

while true ; do
	case "$1" in
	    -n|--min-ev) min_ev=$2 ; shift 2 ;;
	    -x|--max-ev) max_ev=$2 ; shift 2 ;;
	    -c|--spc-ev) ev_space=$2 ; shift 2 ;;
	    -s|--max-s)  saturacion_s=$2 ; shift 2 ;;
	    -r|--max-r)  saturacion_r=$2 ; shift 2 ;; 
	    -E|--exposure-weight)   exposure_weight=$2 ; shift 2 ;; 
	    -S|--saturation-weight) saturation_weight=$2 ; shift 2 ;; 
	    -C|--contrast-weight)   contrast_weight=$2 ; shift 2 ;; 
	    -d|--wavelet-denoising) wavelet_denoising=$2 ; shift 2 ;; 
	    -H|--highlight-mode-s)  highlight_mode_s=$2 ; shift 2 ;;
	    -p|--highlight-mode-r)  highlight_mode_r=$2 ; shift 2 ;;
	    -z|--zenity-mode)       zenity_mode=1 ; shift ;;
	    -T|--no-remove-tmp)     remove_tmp=0 ; shift ;;
	    --) shift ; break ;;
	    *) echo "Internal error!" ; exit 1 ;;
	esac
done

# Si no hay posibles imagenes como argumento
if [ $# -eq 0 ]; then
    print_help
else
    # Para todas las imagenes recibidas
    for file_raw ; do
	revelar_raw
    done
fi
