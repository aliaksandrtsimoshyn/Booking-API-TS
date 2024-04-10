pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
            args '-u root --privileged'
        }
    }
    
    stages {
        // stage('Install Playwright') {
        //     steps {
        //         sh '''
        //         npm i -D @playwright/test
        //         npx playwright install
        //         '''
        //     }
        // }
        
        stage('Run Tests') {
            steps {
                withEnv(['URL=https://bookings-api-667x.onrender.com', 
                         'ADMINNAME=alex', 
                         'ADMINPASSWORD=7777777', 
                         'CUSTOMERNAME=alexcust', 
                         'CUSTOMERPASSWORD=7777777'])
                sh 'npx playwright test'
            }
        }
    }
}

