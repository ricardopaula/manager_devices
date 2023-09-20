# Manager ewelink devices
Turns a specific ewelink device on and off via http requests

## run with docker:

set .env values

```
docker-compose build
docker-compose up
```
## usage
### turn off device
```
get http://localhost:3030/off?token=<token defined in .env>
```

### turn on device
```
get http://localhost:3030/on?token=<token defined in .env>
```
