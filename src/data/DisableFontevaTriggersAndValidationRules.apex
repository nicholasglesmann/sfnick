OrgDataMoverConfig initialConfig = new OrgDataMoverConfig();
initialConfig.modifyTriggers = new List<String>{'OrderApi__App_Config__c', 'Profile', 'Framework__System_Log__c', 'DirectoryApi__Site_Directory__c', 'EventApi__Seat__c', 'EventApi__Section_Ticket__c', 'EventApi__Section__c', 'PagesApi__Page_Element_Attribute__c', 'PagesApi__Page_Element__c', 'Framework__Fonteva_Language__c', 'Framework__Translation__c' };
initialConfig.modifyValidation = new List<String>{};
initialConfig.modifyTriggersAndValidation = new List<String>{};

OrgDataMoverConfig dataLoadConfig = new OrgDataMoverConfig();
dataLoadConfig.modifyTriggers = null; // Null value in modifyTriggers or modifyValidation will modify ALL triggers or validation
dataLoadConfig.modifyValidation = null;
dataLoadConfig.modifyTriggersAndValidation = new List<String>{};

run('before');

void run(String beforeOrAfterDataLoad)
{
    if (beforeOrAfterDataLoad == 'before') {
        // BEFORE DATA LOAD
        updateOrg('disable', dataLoadConfig);
    } else if (beforeOrAfterDataLoad == 'after') {
        // AFTER DATA LOAD
        updateOrg('enable', dataLoadConfig);
        updateOrg('disable', initialConfig);
    }
}

public class OrgDataMoverConfig {
    public List<String> modifyTriggers = new List<String>();
    public List<String> modifyValidation = new List<String>();
    public List<String> modifyTriggersAndValidation = new List<String>();

    public Set<String> getAllSObjectNamesToModify()
    {
        Set<String> allSObjectNamesToModify = new Set<String>();

        if (this.modifyTriggers != null) allSObjectNamesToModify.addAll(this.modifyTriggers);
        if (this.modifyValidation != null) allSObjectNamesToModify.addAll(this.modifyValidation);
        if (this.modifyTriggersAndValidation != null) allSObjectNamesToModify.addAll(this.modifyTriggersAndValidation);

        return allSObjectNamesToModify;
    }
}

public class RegisteredObjectConfig {
    public String sObjectName;
    public String namespace;
    public String apexClass;
    public String soqlLimit;
    public String soqlOrderBy;
    public Boolean isEnabled;
    public Boolean triggersEnabled;
    public Boolean validationDisabled;

    public String toJSON() { return JSON.serialize(this); }
}

Map<String,RegisteredObjectConfig> getRegisteredObjectExistingConfigs() {
    Map<String, Object> frameworkConfig = (Map<String, Object>) JSON.deserializeUntyped(Framework.Config.export(true));

    List<Object> registeredApps = (List<Object>) frameworkConfig.get('registeredApps');

    List<Object> registeredObjects = new List<Object>();

    for (Integer i = 0; i < registeredApps.size(); i++) {
        Map<String,Object> registeredApp = (Map<String,Object>) registeredApps[i];
        registeredObjects.addAll((List<Object>) registeredApp.get('registeredObjects'));
    }

    Map<String,RegisteredObjectConfig> registeredObjectConfigs = new Map<String,RegisteredObjectConfig>();

    for (Integer i = 0; i < registeredObjects.size(); i++) {

        Map<String,Object> registeredObject = (Map<String,Object>) registeredObjects[i];
        RegisteredObjectConfig registeredObjectConfig = createConfigFromExistingRegisteredObject(registeredObject);
        registeredObjectConfigs.put(registeredObjectConfig.sObjectName, registeredObjectConfig);
    }

    return registeredObjectConfigs;
}

RegisteredObjectConfig createConfigFromExistingRegisteredObject(Map<String,Object> registeredObject) {
    RegisteredObjectConfig registeredObjectConfig = new RegisteredObjectConfig();
    registeredObjectConfig.sObjectName = (String) registeredObject.get('sObjectName');
    registeredObjectConfig.namespace = (String) registeredObject.get('namespace');
    registeredObjectConfig.apexClass = (String) registeredObject.get('apexClass');
    registeredObjectConfig.soqlLimit = (String) registeredObject.get('soqlLimit');
    registeredObjectConfig.soqlOrderBy = (String) registeredObject.get('soqlOrderBy');
    registeredObjectConfig.isEnabled = (Boolean) registeredObject.get('isEnabled');
    registeredObjectConfig.triggersEnabled = (Boolean) registeredObject.get('triggersEnabled');
    registeredObjectConfig.validationDisabled = (Boolean) registeredObject.get('validationDisabled');

    return registeredObjectConfig;
}

void updateOrg(String disableOrEnable, OrgDataMoverConfig orgConfig) {
    List<RegisteredObjectConfig> registeredObjectFinalConfigs = mergeExistingConfigWithNewConfig(orgConfig, disableOrEnable);

    List<Framework.RegisteredObject> registeredObjects = new List<Framework.RegisteredObject>();

    for (RegisteredObjectConfig registeredObjectConfig : registeredObjectFinalConfigs)
    {
        Framework.RegisteredObject registeredObject = convertJSONToFrameworkRegisteredObject(registeredObjectConfig.toJSON());
        registeredObjects.add(registeredObject);
    }

    Framework.Config.push(registeredObjects);
}

List<RegisteredObjectConfig> mergeExistingConfigWithNewConfig(OrgDataMoverConfig orgConfig, String disableOrEnable)
{
    Map<String,RegisteredObjectConfig> registeredObjectExistingConfigs = getRegisteredObjectExistingConfigs();

    List<RegisteredObjectConfig> registeredObjectFinalConfigs = new List<RegisteredObjectConfig>();

    Set<String> allSObjectToChange = orgConfig != null ? orgConfig.getAllSObjectNamesToModify() : null;

    for (String sObjectName : registeredObjectExistingConfigs.keySet())
    {
        RegisteredObjectConfig registeredObject = registeredObjectExistingConfigs.get(sObjectName);

        if (shouldModifyTrigger(orgConfig, sObjectName))
        {
            registeredObject.triggersEnabled = shouldEnableTrigger(disableOrEnable, registeredObject);
        }

        if (shouldModifyValidation(orgConfig, sObjectName))
        {
            registeredObject.validationDisabled = shouldDisableValidation(disableOrEnable, registeredObject);
        }

        registeredObjectFinalConfigs.add(registeredObject);
    }

    return registeredObjectFinalConfigs;
}

Boolean shouldEnableTrigger(String disableOrEnable, RegisteredObjectConfig registeredObject) {
    if (disableOrEnable == 'disable') { return false; }
    else if (disableOrEnable == 'enable') { return true; }
    return registeredObject.triggersEnabled;
}

Boolean shouldDisableValidation(String disableOrEnable, RegisteredObjectConfig registeredObject) {
    if (disableOrEnable == 'disable') { return true; }
    else if (disableOrEnable == 'enable') { return false; }
    return registeredObject.validationDisabled;
}

Boolean shouldModifyTrigger(OrgDataMoverConfig orgConfig, String sObjectName) {
    if (orgConfig == null || orgConfig.modifyTriggers == null) { return true; }
    return (orgConfig.modifyTriggers.contains(sObjectName) || orgConfig.modifyTriggersAndValidation.contains(sObjectName));
}

Boolean shouldModifyValidation(OrgDataMoverConfig orgConfig, String sObjectName) {
    if (orgConfig == null || orgConfig.modifyValidation == null) { return true; }
    return (orgConfig.modifyValidation.contains(sObjectName) || orgConfig.modifyTriggersAndValidation.contains(sObjectName));
}

Framework.RegisteredObject convertJSONToFrameworkRegisteredObject(String regObjectJSON) { return (Framework.RegisteredObject) JSON.deserialize(regObjectJSON, Framework.RegisteredObject.class); }
