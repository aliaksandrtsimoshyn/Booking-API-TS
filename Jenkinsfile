pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
            args '-u root --privileged'
        }
    }
    
    stages {
        stage('Install Playwright') {
            steps {
                sh '''
                npm i -D @playwright/test
                npx playwright install
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}

