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
                withCredentials([
            string(credentialsId: 'url', variable: 'URL'),
            string(credentialsId: 'adminName', variable: 'ADMINNAME'),
            string(credentialsId: 'adminPassword', variable: 'ADMINPASSWORD'),
            string(credentialsId: 'customerName', variable: 'CUSTOMERNAME'),
            string(credentialsId: 'customerPassword', variable: 'CUSTOMERPASSWORD')
        ]) {
                    sh 'npx playwright test'
                }
            }
            post {
        always {
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'HTML Report'
            ])
        }
    }
        }
    }
}

