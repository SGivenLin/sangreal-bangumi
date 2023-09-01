module.exports=  {
    "extends": [
        "react-app",
        "react-app/jest",
    ],
    "overrides": [{
        files: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.js', 'src/**/*.jsx'],
        rules: {
            "semi": [2, "never"],
            "comma-dangle": ["error", "always-multiline"],
            "indent": [2, 4],
            "import/no-cycle": 'error',
        },
    }],
}