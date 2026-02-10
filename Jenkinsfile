pipeline {
    agent any
    
    // Définition des variables d'environnement
    environment {
        // Nom de l'image Docker (à modifier selon votre nom d'utilisateur Docker Hub)
        DOCKER_IMAGE = "leitheng/mon-app-devops"
        // ID des credentials Docker Hub configurés dans Jenkins
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
    }
    
    stages {
        // ==========================================
        // STAGE 1 : CHECKOUT - Récupération du code
        // ==========================================
        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source depuis Git...'
                // Jenkins récupère automatiquement le code du dépôt Git configuré
                checkout scm
                echo '✅ Code source récupéré avec succès'
            }
        }
        
        // ==========================================
        // STAGE 2 : UNIT TESTS - Exécution des tests
        // ==========================================
        stage('Unit Tests') {
            /* On utilise l'agent Docker spécifiquement pour ce stage.
               Jenkins va lancer un conteneur 'node:18-alpine', y monter votre code,
               et exécuter les commandes à l'intérieur.
            */
            agent {
                docker {
                    image 'node:18-alpine'
                    args '-u root' // Optionnel : utile si vous avez des problèmes de permissions
                }
            }
            steps {
                echo '🧪 Exécution des tests dans le conteneur Node...'
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        // ==========================================
        // STAGE 3 : DOCKER BUILD - Construction de l'image
        // ==========================================
        stage('Docker Build') {
            steps {
                echo '🐳 Construction de l\'image Docker...'
                script {
                    // Construction de l'image avec le tag du numéro de build Jenkins
                    // BUILD_NUMBER est une variable d'environnement Jenkins automatique
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                    """
                }
                echo "✅ Image Docker construite : ${DOCKER_IMAGE}:${BUILD_NUMBER}"
            }
        }
        
        // ==========================================
        // STAGE 4 : DOCKER PUSH - Publication sur Docker Hub
        // ==========================================
        stage('Docker Push') {
            // Cette étape ne s'exécute que si les tests sont passés
            steps {
                echo '📤 Publication de l\'image sur Docker Hub...'
                script {
                    // Utilisation de withCredentials pour sécuriser les identifiants
                    // Les credentials ne seront jamais affichés dans les logs
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        // Connexion à Docker Hub de manière sécurisée
                        sh '''
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        '''
                        
                        // Push des deux tags : latest et numéro de build
                        sh """
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                        
                        // Déconnexion pour sécurité
                        sh 'docker logout'
                    }
                }
                echo '✅ Image publiée sur Docker Hub avec succès'
            }
        }
    }
    
    // ==========================================
    // POST - Actions après l'exécution du pipeline
    // ==========================================
    post {
        success {
            echo '🎉 Pipeline exécuté avec succès !'
            echo "Image disponible : ${DOCKER_IMAGE}:${BUILD_NUMBER} et ${DOCKER_IMAGE}:latest"
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifiez les logs ci-dessus.'
        }
        always {
            // Nettoyage des images locales pour libérer l'espace disque
            echo '🧹 Nettoyage des images Docker locales...'
            sh """
                docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true
                docker rmi ${DOCKER_IMAGE}:latest || true
            """
        }
    }
}
