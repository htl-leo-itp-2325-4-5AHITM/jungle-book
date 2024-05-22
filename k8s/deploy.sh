#!/usr/bin/env bash
set -e

# docker package names cannot contain uppercase letters:
LC_GH_USER_NAME=htl-leo-itp-2325-4-5ahitm
BACKEND_IMAGE_NAME=ghcr.io/$LC_GH_USER_NAME/jungle-book-backend:latest
FRONTEND_IMAGE_NAME=ghcr.io/$LC_GH_USER_NAME/jungle-book-nginx:latest

export BACKEND_IMAGE_NAME
export FRONTEND_IMAGE_NAME

bold=$(tput bold)
normal=$(tput sgr0)

build_yamlfiles() {
    local YAMLS="postgres appsrv nginx keycloak"
    local yamlfile

    mkdir -p target
    rm -rf ./target/*
    for yaml in $YAMLS
    do
        yamlfile=$yaml.yaml
        echo "yamlfile is $yamlfile"
        envsubst '\$BACKEND_IMAGE_NAME,\$FRONTEND_IMAGE_NAME,\$BASE_HREF' < $yamlfile > ./target/$yamlfile
    done
    pushd target
        for yaml in *.yaml
        do
            kubectl apply -f $yaml
        done
    popd
}
build_yamlfiles

echo "TAG and push image $BACKEND_IMAGE_NAME and $FRONTEND_IMAGE_NAME..."

docker image tag backend $BACKEND_IMAGE_NAME
docker push $BACKEND_IMAGE_NAME

docker image tag frontend $FRONTEND_IMAGE_NAME
docker push $FRONTEND_IMAGE_NAME
docker image ls

kubectl delete configmap nginx-config || echo "nginx-config does not yet exist"
kubectl create configmap nginx-config --from-file ../jungle-book-frontend/docker/default.conf

kubectl get pods

echo "----------"
echo "DO NOT FORGET: make the ${bold}docker image public${normal} on ghcr.io"
echo "----------"
