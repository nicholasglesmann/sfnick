List<String> objectsToCountRecords = new List<String>{'PagesApi__Theme__c','OrderApi__Business_Group__c','OrderApi__GL_Account__c','OrderApi__Payment_Terms__c','OrderApi__Payment_Gateway__c','OrderApi__Custom_Payment_Type__c','OrderApi__Shipping_Region__c','OrderApi__Tax_Locale__c','LTE__Site__c','LTE__Menu_Item__c','OrderApi__Store__c','PagesApi__Site__c','PagesApi__Page__c','PagesApi__Page_Element__c','PagesApi__Page_Element_Attribute__c','OrderApi__Item__c','OrderApi__Item_Class__c','OrderApi__Assignment_Role__c','PriceApi__Bulk_Price_Rule__c','OrderApi__Price_Rule__c','OrderApi__Price_Rule_Variable__c','OrderApi__Subscription_Plan__c','OrderApi__Item_Subscription_Plan__c','OrderApi__Package_Item__c','OrderApi__Badge_Type__c','OrderApi__Badge_Workflow__c','EventApi__Event__c','EventApi__Ticket_Type__c','EventApi__Section__c','EventApi__Seat__c','EventApi__Section_Ticket__c','EventApi__Event_Status__c','EventApi__Event_Page__c','EventApi__Event_Status_Page__c','EventApi__Event_Page_Component__c','EventApi__Track__c','LTE__Site_Event__c','OrderApi__Renewal_Path__c','OrderApi__Renewal_Path_Variable__c','PagesApi__Community_Group__c','OrderApi__Catalog__c','OrderApi__Catalog_Item__c','OrderApi__Shipping_Method__c','OrderApi__Source_Code__c','OrderApi__Campaign_Page__c','OrderApi__Batch__c','joinapi__Join_Process__c','joinapi__Step__c','joinapi__Step_Condition__c','DRCTS__Directories__c','PagesApi__Form__c','PagesApi__Field_Group__c','PagesApi__Field__c','PagesApi__Skip_Logic_Rule__c','PagesApi__Media_Asset__c','PagesApi__Media_Asset_Collection__c','EventApi__Event_Category__c','EventApi__Site_Event_Category__c','EventApi__Venue__c','EventApi__Room__c','EventApi__Schedule_Item__c','EventApi__Track_Schedule_Item__c','EventApi__Ticket_Schedule_Item__c','EventApi__Speaker__c','EventApi__Speaker_Schedule_Item__c','EventApi__Sponsor_Package__c','EventApi__Sponsor__c','EventApi__Vendor__c','PagesApi__Menu__c','PagesApi__Menu_Item__c','OrderApi__Access_Permission__c','ProgramApi__Program_Type__c','ProgramApi__Program__c','ProgramApi__Program_Profile__c','ProgramApi__Requirement__c','ProgramApi__Program_Term__c','ProgramApi__Goals__c'};

String dataMoverTestFactory = '';
dataMoverTestFactory += 'Map<String,Integer> getCreatedRecordCounts()\n';
dataMoverTestFactory += '{\n';
dataMoverTestFactory += '    return new Map<String, Integer>{\n';

for (Integer i = 0; i < objectsToCountRecords.size(); i++)
{
    String query = 'SELECT Id FROM ' + objectsToCountRecords[i];
    List<sObject> records = Database.query(query);
    dataMoverTestFactory += '       \'' + objectsToCountRecords[i] + '\' => ' + records.size();
    dataMoverTestFactory += (i == objectsToCountRecords.size() - 1) ? '\n' : ',\n';
}

dataMoverTestFactory += '    };\n';
dataMoverTestFactory += '}\n\n';



dataMoverTestFactory += 'Map<String,Integer> getDeletedRecordCounts()\n';
dataMoverTestFactory += '{\n';
dataMoverTestFactory += '    return new Map<String, Integer>{\n';

for (Integer i = 0; i < objectsToCountRecords.size(); i++)
{
    dataMoverTestFactory += '       \'' + objectsToCountRecords[i] + '\' => ' + '0';

    dataMoverTestFactory += (i == objectsToCountRecords.size() - 1) ? '\n' : ',\n';
}

dataMoverTestFactory += '    };\n';

dataMoverTestFactory += '}\n';

System.debug(dataMoverTestFactory);
