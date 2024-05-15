#!/usr/bin/env bash
# build the application, push the docker image and deploy it on the current cluster

set -e
bold=$(tput bold)
normal=$(tput sgr0)

GITHUB_REPO_USER=htl-leo-itp-2325-4-5AHITM
GITHUB_USER=$(git config user.name) | tr '[:upper:]' '[:lower:]')

BASE_HREF=${BASE_HREF:-"/m.schablinger/"}
NAMESPACE=${NAMESPACE:-"student-m-schablinger"}

if [[ -z ${GITHUB_USER} ]]
then
    echo "You must set the environment variable GITHUB_USER to your github user name"
    exit 1
fi

if [[ "$GITHUB_USER" == "$GITHUB_REPO_USER" ]]
then
    echo "compile code in your own repo"
else
    echo "Your github user name $GITHIB_USER does not match the repo owner's name $GITHUB_REPO_USER..."
    sleep 1
fi

export GITHUB_USER
export BASE_HREF

echo "building deployment using github account ${bold}$GITHUB_USER${normal}, namespace \"$NAMESPACE\" and ingress root \"$BASE_HREF\""

kubectl config set-context --current --namespace $NAMESPACE || (echo "please set up your cloud environment so that the following command works: ${bold}kubectl get nodes${normal}" && exit 2)

pushd jungle-book-backend
    ./build.sh || exit 4
    kubectl rollout restart deployment/appsrv || echo "backend no restart ... propably not deployed yet"
popd

pushd jungle-book-frontend
    ./build.sh
    kubectl rollout restart deployment/nginx || echo "frontend no restart ... propably not deployed yet"
popd

#pushd k8s
#    ./deploy.sh
#popd

watch -t kubectl get pods

POD=$(kubectl get pods | grep nginx | cut -d\  -f 1)
echo "when all pods are running enter the following:"
echo "=============================================="
echo "${bold}kubectl port-forward $POD 4200:80${normal}"
echo "=============================================="
echo "then open http://localhost:4200 in your browser"
