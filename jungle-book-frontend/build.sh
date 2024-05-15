rm -rf target
mkdir -p target/nginx
cp ./docker/default.conf ./target/nginx/

docker build --tag frontend --file ./docker/Dockerfile ./target/
