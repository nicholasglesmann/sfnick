export default {

    FONTEVA_CI_CD_CLIENT_ID: "fonteva_ci_cd_client_id",
    FONTEVA_CI_CD_CLIENT_SECRET: "fonteva_ci_cd_client_secret",


    ORG_URLS: {
        LIGHTNING_SETUP: 'lightning/setup/SetupOneHome/home',
        DEPLOYMENT_STATUS: 'lightning/setup/DeployStatus/home'
    },

    DATA_MOVER_FOLDER_NAME: 'configData',
    DATA_MOVER_EXPORT_FILENAME: 'export.json',

    DATA_MOVER: {
        JOIN_PROCESS_FOLDER_NAME: 'joinProcess'
    },


    FILEPATH: {
        DATA_MOVER_CONFIG: '/../data/defaultFontevaConfigDataConfigForSFDMU.json',
        SCRATCH_ORG_CONFIG: '/../data/scratchOrgConfig.json',
        DISABLE_FONTEVA_TRIGGERS_VALIDATION_APEX: '/../data/DisableFontevaTriggersAndValidationRules.apex',
        ENABLE_FONTEVA_TRIGGERS_VALIDATION_APEX: '/../data/EnableFontevaTriggersAndValidationRules.apex',
        FONTEVA_FRAMEWORK_CONFIG_QUERY_APEX: '/../data/FontevaFrameworkConfigQuery.apex',
        FONTEVA_FRAMEWORK_CONFIG_UPLOAD_APEX: '/../data/FontevaFrameworkConfigUpload.apex'
    }

};
