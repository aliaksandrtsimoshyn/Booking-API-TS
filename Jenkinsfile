pipeline {
    agent any
    //{ docker { image 'mcr.microsoft.com/playwright:v1.42.1-jammy' } }
    
    stages {
    //     stage('Install playwright') {
    //         steps {

    //         sh '''
    //         npm i -D @playwright/test
    //         npx playwright install'''

    //                 }
    //     }
        
    //     stage('help') {
    //         steps {
    //             sh 'npx playwright test --help'
    //         }
    //     }
        
        stage('test') {
            steps {
                sh ''' npx playwright test --list
                npx playwright test '''
            }
        }
    }
}

