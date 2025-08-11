<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en modo desarrollo

1. Clonar el repositorio.
2. Instalar dependencias.
```
npm install
```
3. Tener Nest CLI instalado.
```
npm i -g @nestjs/cli
```
4. Crear un archivo `.env` basado en `.env.template`.
5. Levantar la base de datos y administrador gráfico con Docker.
```
docker compose up -d
```
6. Ejecutar la app.
```
npm run start:dev
```

7. Popular base de datos.
```
http://localhost:3001/seed
```

8. Descargar las [imágenes](https://import.cdn.thinkific.com/643563/courses/1939714/products-220722-161630.zip) y guardarlas dentro de `static/products`.
