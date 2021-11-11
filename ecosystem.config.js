module.exports = {
  apps : [{
    name: 'app',                        // pm2 name
    script: 'index.js',                 // 맵 실행 스크립트
    exec_mode: 'cluster',               // fort, cluster 모드 중 선택
    instances: 3,                       // 클러스터 모드 사용 시 생성할 인스턴스 수
    watch: false,                       // 파일이 변경되었을 때 재시작 여부
    merge_logs: true,                   // 클러스터 모드 사용 시 각 클러스터에서 생성되는 로그를 한 파일로 합쳐줌
    // autorestart: true,               // 프로세스 실패 시 자동 재시작 여부
    // max_memory_restart: "512M",      // 프로그램의 메모리 크기가 일정 크기 이상이 되면 재시작
    time: true,                         // pm2 log 에서 콘솔들의 입력 시간이 언제인지 확인 가능
    increment_var: 'PORT',              // 각 인스턴스에 대해 PORT 변수를 증가시킴
    env: {
      // 개발 환경 설정
      'PORT': 3001,
      'NODE_ENV': 'development',
    },
    env_production: {
      // 운영 환경 설정
      // 'PORT': 3000,
      'NODE_ENV': 'production',
    }
  }],
  // }, {
  //   script: './service-worker/',
  //   watch: ['./service-worker']
  // }],

  // 배포
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      // 가장 중요 pm2에 의한 배포가 끝난 후 실행
      // npm 패키지 install & 프로세스 재시작
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
