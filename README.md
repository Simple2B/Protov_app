# Deploy

1. In AWS console open EC2, launch and configurate instance (save RSA key)
2. Configurate ssh and launch by ssh

   ```
   shh $hostname
   ```

3. Install docker, docker-compose, nginx
4. Create docker-compose.yaml file:

   ```version: "3"
   services:
   app:
   image: istacat/protov
   ports: - 127.0.0.1:9500:8
   ```

5. istacat/protov – our docker hub account, you need to create such account by yourself and change it in docker-compose.yaml file in image
6. Open code with frontend locally or on another dev machine
7. Make some change if needed and run:
   ```
   docker login (credentials from docker hub)
   ```
   ```
   docker-compose build
   ```
   ```
   docker-compose push
   ```
8. Open your virtual machine by ssh and run:

   ```
   docker-compose stop app
   ```

   ```
   docker-compose rm app
   ```

   ```
   docker-compose pull app
   ```

   ```
   docker-compose up -d
   ```
