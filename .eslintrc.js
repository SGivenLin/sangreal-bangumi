module.exports=  {
    "extends": [
        "react-app",
        "react-app/jest",
    ],
    "rules": {
        "semi": [2, "never"],
        "comma-dangle": ["error", "always-multiline"],
        "indent": [2, 4],
        "import/no-cycle": 'error',
    },
}