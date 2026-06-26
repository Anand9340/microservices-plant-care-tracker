pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = "anandsingh93/plant-care"
        AWS_REGION = "ap-south-1"
        K8S_CLUSTER_NAME = "anand-cluster"
        NAMESPACE = 'default'
        APP_NAME = 'plant-care'

        DEPLOYMENT_NAME = "plant-care-app"
        SERVICE_NAME    = "plant-care-service"
        INGRESS_NAME    = "plant-care-ingress"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/Anand9340/microservices-plant-care-tracker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = "${BUILD_NUMBER}"

                    sh """
                    docker build -t ${DOCKER_HUB_REPO}:${IMAGE_TAG} .
                    docker tag ${DOCKER_HUB_REPO}:${IMAGE_TAG} ${DOCKER_HUB_REPO}:latest
                    """
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh """
                    echo \$DOCKER_PASSWORD | docker login \
                    -u \$DOCKER_USERNAME \
                    --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}
                docker push ${DOCKER_HUB_REPO}:latest
                """
            }
        }

        stage('Configure AWS & EKS') {
            steps {

                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds']
                ]) {

                    sh """
                    aws configure set region ${AWS_REGION}

                    aws eks update-kubeconfig \
                    --region ${AWS_REGION} \
                    --name ${K8S_CLUSTER_NAME}

                    kubectl get nodes
                    """
                }
            }
        }

        stage('Update Deployment Image') {
            steps {

                sh """
                sed -i 's|${DOCKER_HUB_REPO}:latest|${DOCKER_HUB_REPO}:${IMAGE_TAG}|g' k8s/deployment.yaml
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {

                sh """
                kubectl apply -f k8s/deployment.yaml

                kubectl rollout status deployment/${DEPLOYMENT_NAME} --timeout=300s

                kubectl get pods

                kubectl get svc ${SERVICE_NAME}
                """
            }
        }

        stage('Deploy Ingress') {
            steps {

                sh """
                kubectl apply -f k8s/ingress.yaml
                sleep 10
                kubectl get ingress ${INGRESS_NAME}
                kubectl describe ingress ${INGRESS_NAME}
                """
            }
        }

        stage('Get Application URL') {
            steps {

                script {

                    timeout(time: 10, unit: 'MINUTES') {

                        waitUntil {

                            def hostname = sh(
                                script: "kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
                                returnStdout: true
                            ).trim()

                            if (hostname) {

                                env.APP_URL = "http://${hostname}"

                                return true
                            }

                            return false
                        }
                    }

                    echo "===================================="
                    echo "Deployment Successful"
                    echo "Application URL : ${APP_URL}"
                    echo "===================================="

                    sh "curl -I ${APP_URL} || true"
                }
            }
        }

    }

    post {

        always {

            echo "Cleaning Docker Images..."

            sh """
            docker rmi ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true
            docker rmi ${DOCKER_HUB_REPO}:latest || true
            """
        }

        success {

            echo "Pipeline Executed Successfully"

            echo "Application URL : ${APP_URL}"
        }

        failure {

            echo "Pipeline Failed"
        }
    }
}
