#!/bin/bash

# Ruta de la carpeta compartida
share_path_origen="//10.150.1.201/grabaciones"
share_path_destino="//10.150.1.201/solicitudes"

# Nombre de usuario y contraseña para autenticación
username="someuser"
password="somepassword"

# Carpeta de origen en el servidor
carpeta_origen="/2023-01-16"

# Carpeta de destino en el servidor
carpeta_destino="/copy"
carpeta_tmp="/tmp"

# Lista de nombres de archivos que deseas copiar
archivos=("20230116181759_7452223_3207689873-all.mp3" "20230116-070621_3137097021_PROPIA5_M1160706210015314839-all.mp3")



for archivo in "${archivos[@]}"; do

  echo "get $carpeta_origen/$archivo $carpeta_tmp" | smbclient "$share_path_origen" -U "$username%$password"

  #comando="scopy $carpeta_origen/$archivo $carpeta_destino/$archivo"

  #echo "Ejecutando: $comando"
  #echo "$comando" | smbclient "$share_path" -U "$username%$password"

  if [ $? -eq 0 ]; then
    echo "Archivo $archivo copiado exitosamente."
  else
    echo "Error al copiar el archivo $archivo."
  fi
done