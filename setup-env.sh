#!/bin/bash

# Script para crear archivo .env desde env.example

if [ -f .env ]; then
    echo "⚠️  El archivo .env ya existe."
    read -p "¿Deseas sobrescribirlo? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operación cancelada."
        exit 0
    fi
fi

if [ ! -f env.example ]; then
    echo "❌ Error: No se encontró el archivo env.example"
    exit 1
fi

cp env.example .env

echo "✅ Archivo .env creado desde env.example"
echo ""
echo "⚠️  IMPORTANTE: Edita el archivo .env y completa las siguientes variables REQUERIDAS:"
echo "   - CLIENT_URL"
echo "   - ADMIN_CLIENT_URL"
echo "   - VITE_API_URL"
echo "   - SESSION_SECRET"
echo ""
echo "Puedes generar un SESSION_SECRET seguro con:"
echo "   openssl rand -base64 32"
