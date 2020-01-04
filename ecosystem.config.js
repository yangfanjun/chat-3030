module.exports = {
    apps: [{
        name: "3030",
        script: "./bin/www",
        env: {
            "PORT": 3030,
            'NODE_ENV': "development",
        }
    },
    {
        name: "3040",
        script: "./bin/www",
        env: {
            "PORT": 3040,
            'NODE_ENV': "development",
        }
    },
    {
        name: "3050",
        script: "./bin/www",
        env: {
            "PORT": 3050,
            'NODE_ENV': "development",
        }
    }
]
};
