sfnick
=======

A sfnick CLI Tool

[![Version](https://img.shields.io/npm/v/sfnick.svg)](https://npmjs.org/package/sfnick)
[![CircleCI](https://circleci.com/gh/nicholasglesmann/sfnick/tree/main.svg?style=shield)](https://circleci.com/gh/nicholasglesmann/sfnick/tree/main)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/sfnick/sfnick?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfnick/branch/master)
[![Codecov](https://codecov.io/gh/sfnick/sfnick/branch/master/graph/badge.svg)](https://codecov.io/gh/sfnick/sfnick)
[![Greenkeeper](https://badges.greenkeeper.io/sfnick/sfnick.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/nicholasglesmann/sfnick/badge.svg)](https://snyk.io/test/github/nicholasglesmann/sfnick)
[![Downloads/week](https://img.shields.io/npm/dw/sfnick.svg)](https://npmjs.org/package/sfnick)
[![License](https://img.shields.io/npm/l/sfnick.svg)](https://github.com/sfnick/sfnick/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfnick
$ sfnick COMMAND
running command...
$ sfnick (-v|--version|version)
sfnick/0.0.5 win32-x64 node-v10.24.1
$ sfnick --help [COMMAND]
USAGE
  $ sfnick COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfnick fonteva:check:duplicateValues -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacheckduplicatevalues--o-string--m-string--f-string--z--t--b-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:compare:packageVersions -f <string> -s <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacomparepackageversions--f-string--s-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:compare:recordCounts -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacomparerecordcounts--s-string--t-string--p-string--d-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:connect [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaconnect--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:count:records [-p <string>] [-o <string>] [-q <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacountrecords--p-string--o-string--q-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:create:migrationIdFields [-p <string>] [-o <string>] [-z] [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacreatemigrationidfields--p-string--o-string--z--t--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:create:scratchorg [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacreatescratchorg--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:create:testdata -o <string> [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevacreatetestdata--o-string--t--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:deactivate:users [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevadeactivateusers--f-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:deploy:data [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevadeploydata--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:destroy:csvRecords -p <string> -o <string> -f <string> [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevadestroycsvrecords--p-string--o-string--f-string--z--t--b-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:destroy:records [-p <string>] [-o <string>] [-q <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevadestroyrecords--p-string--o-string--q-string--z--t--b-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:ASAONLYticketType [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixasaonlytickettype--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:field -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixfield--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:fontevaRecords -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixfontevarecords--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:joinProcess -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixjoinprocess--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:priceRule -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixpricerule--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:priceRuleVariable -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixpricerulevariable--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:fix:skipLogicRule -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevafixskiplogicrule--s-string--t-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:modify:field -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevamodifyfield--o-string--m-string--f-string--z--t--b-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:open [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaopen--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:open:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaopenfull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:open:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaopenprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:open:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaopenuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:post:salesorder -o <string> -m <string> [-f <string>] [-z] [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevapostsalesorder--o-string--m-string--f-string--z--t--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:dashboards [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedashboards--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:dashboards:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedashboardsfull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:dashboards:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedashboardsprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:dashboards:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedashboardsuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:data [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedata--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:documents [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievedocuments--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:emailTemplates [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveemailtemplates--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:emailTemplates:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveemailtemplatesfull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:emailTemplates:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveemailtemplatesprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:emailTemplates:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveemailtemplatesuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:installedPackages [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveinstalledpackages--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:managedObjects [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievemanagedobjects--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:reports [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievereports--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:reports:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievereportsfull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:reports:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievereportsprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:reports:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrievereportsuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:workflows [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveworkflows--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:workflows:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveworkflowsfull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:workflows:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveworkflowsprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:retrieve:workflows:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevaretrieveworkflowsuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:secret:set:clientid [-v <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevasecretsetclientid--v-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:secret:set:clientsecret [-v <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevasecretsetclientsecret--v-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:test -s <string> -t <string> [-p <string>] [-d <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatest--s-string--t-string--p-string--d-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:toggle:triggers [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatoggletriggers--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:transfer:configData -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatransferconfigdata--s-string--t-string--p-string--d-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:transfer:configDataWithId -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatransferconfigdatawithid--s-string--t-string--p-string--d-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:transfer:joinProcess -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatransferjoinprocess--s-string--t-string--p-string--d-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:transfer:sparkAdmin -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevatransfersparkadmin--s-string--t-string--p-string--d-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:validate [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevavalidate--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:validate:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevavalidatefull--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:validate:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevavalidateprod--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfnick fonteva:validate:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfnick-fontevavalidateuat--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfnick fonteva:check:duplicateValues -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify the value of one or more fields on a single object

```
modify the value of one or more fields on a single object

USAGE
  $ sfnick fonteva:check:duplicateValues -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --batchsize=batchsize
      the batch size to use when updating records (default: 200)

  -f, --filter=filter
      modify only records from a specified filter

  -m, --mapping=mapping
      (required) list of FIELD_TO_UPDATE==VALUE pairs, seperated with &&. Add a ** before the value to indicate that the 
      value of another field on the record should be used. Seperate multiple values for a single field with ++

  -o, --object=object
      (required) modify a field on the specified object

  -t, --disabletriggersvalidationrules
      disable all triggers/validation rules before executing destroy operation. Renables triggers/validation rules after 
      execution.

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  -z, --allowprod
      allows modifying records in a production org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob" -f "FirstName = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Account -m "AdditionalPhone==**Phone" -f "AdditionalPhone = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob&&Title==**LastName" -f "FirstName = null"
```

_See code: [lib/commands/fonteva/check/duplicateValues.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/check/duplicateValues.js)_

## `sfnick fonteva:compare:packageVersions -f <string> -s <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

compare and list differences of package versions between two orgs

```
compare and list differences of package versions between two orgs

USAGE
  $ sfnick fonteva:compare:packageVersions -f <string> -s <string> [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --firstorg=firstorg                                                           (required) first org
  -s, --secondorg=secondorg                                                         (required) second org
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/compare/packageVersions.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/compare/packageVersions.js)_

## `sfnick fonteva:compare:recordCounts -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

compare and list differences of record counts between two orgs

```
compare and list differences of record counts between two orgs

USAGE
  $ sfnick fonteva:compare:recordCounts -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   compare record counts from queries
                                                                                    using the export.json file at the
                                                                                    specified path

  -s, --firstorg=firstorg                                                           (required) the first org SFDX
                                                                                    username

  -t, --secondorg=secondorg                                                         (required) the second org SFDX
                                                                                    username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/compare/recordCounts.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/compare/recordCounts.js)_

## `sfnick fonteva:connect [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

connect any org to SFDX and Fonteva's CI/CD process

```
connect any org to SFDX and Fonteva's CI/CD process

USAGE
  $ sfnick fonteva:connect [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/connect.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/connect.js)_

## `sfnick fonteva:count:records [-p <string>] [-o <string>] [-q <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

count records in an org

```
count records in an org

USAGE
  $ sfnick fonteva:count:records [-p <string>] [-o <string>] [-q <string>] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               count ALL records for the specified
                                                                                    object

  -p, --pathoverride=pathoverride                                                   count records from queries using the
                                                                                    export.json file at the specified
                                                                                    path

  -q, --query=query                                                                 count records returned from the
                                                                                    specified query

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/count/records.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/count/records.js)_

## `sfnick fonteva:create:migrationIdFields [-p <string>] [-o <string>] [-z] [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create migration Id fields on specified object(s) in a target org

```
create migration Id fields on specified object(s) in a target org

USAGE
  $ sfnick fonteva:create:migrationIdFields [-p <string>] [-o <string>] [-z] [-t] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object
      create a Migration ID field on the specified object

  -p, --pathoverride=pathoverride
      create Migration ID field(s) on objects specified in queries using the export.json file at the specified path

  -t, --disabletriggersvalidationrules
      disable ALL Fonteva triggers/validation rules before creating Migration ID field(s); re-enable ALL Fonteva 
      triggers/validation rules after creating Migration ID field(s)

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  -z, --allowprod
      create Migration ID field(s) in a PRODUCTION org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation
```

_See code: [lib/commands/fonteva/create/migrationIdFields.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/create/migrationIdFields.js)_

## `sfnick fonteva:create:scratchorg [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a scratch org using a source org as a template

```
create a scratch org using a source org as a template

USAGE
  $ sfnick fonteva:create:scratchorg [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/create/scratchorg.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/create/scratchorg.js)_

## `sfnick fonteva:create:testdata -o <string> [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create test data in a target org

```
create test data in a target org

USAGE
  $ sfnick fonteva:create:testdata -o <string> [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               (required) create test data the
                                                                                    specified object

  -t, --disabletriggersvalidationrules                                              disable ALL Fonteva
                                                                                    triggers/validation rules before
                                                                                    creating test data; re-enable ALL
                                                                                    Fonteva triggers/validation rules
                                                                                    after creating test data

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/create/testdata.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/create/testdata.js)_

## `sfnick fonteva:deactivate:users [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create users in a target org

```
create users in a target org

USAGE
  $ sfnick fonteva:deactivate:users [-f <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --filter=filter                                                               deactivate users returned from the
                                                                                    specified query

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx fonteva:deactivate:users
```

_See code: [lib/commands/fonteva/deactivate/users.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/deactivate/users.js)_

## `sfnick fonteva:deploy:data [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

deploy all config data to target org

```
deploy all config data to target org

USAGE
  $ sfnick fonteva:deploy:data [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/deploy/data.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/deploy/data.js)_

## `sfnick fonteva:destroy:csvRecords -p <string> -o <string> -f <string> [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

destroy records in target org

```
destroy records in target org

USAGE
  $ sfnick fonteva:destroy:csvRecords -p <string> -o <string> -f <string> [-z] [-t] [-b <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --batchsize=batchsize                                                         the batch size to use when
                                                                                    destroying records (default: 200)

  -f, --matchfields=matchfields                                                     (required) fields used to match
                                                                                    records to delete. separate fields
                                                                                    with a comma (ex.
                                                                                    FirstName,LastName,Title)

  -o, --object=object                                                               (required) destroy ALL records for
                                                                                    the specified object

  -p, --csvpath=csvpath                                                             (required) path to csv file

  -t, --disabletriggersvalidationrules                                              disable ALL Fonteva
                                                                                    triggers/validation rules before
                                                                                    destroying records; re-enable ALL
                                                                                    Fonteva triggers/validation rules
                                                                                    after destroying records

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -z, --allowprod                                                                   destroy records in a PRODUCTION org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/destroy/csvRecords.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/destroy/csvRecords.js)_

## `sfnick fonteva:destroy:records [-p <string>] [-o <string>] [-q <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

destroy records in target org

```
destroy records in target org

USAGE
  $ sfnick fonteva:destroy:records [-p <string>] [-o <string>] [-q <string>] [-z] [-t] [-b <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --batchsize=batchsize                                                         the batch size to use when
                                                                                    destroying records (default: 200)

  -o, --object=object                                                               destroy ALL records for the
                                                                                    specified object

  -p, --pathoverride=pathoverride                                                   destroy records from queries using
                                                                                    the export.json file at the
                                                                                    specified path

  -q, --query=query                                                                 destroy records returned from the
                                                                                    specified query

  -t, --disabletriggersvalidationrules                                              disable ALL Fonteva
                                                                                    triggers/validation rules before
                                                                                    destroying records; re-enable ALL
                                                                                    Fonteva triggers/validation rules
                                                                                    after destroying records

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -z, --allowprod                                                                   destroy records in a PRODUCTION org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/destroy/records.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/destroy/records.js)_

## `sfnick fonteva:fix:ASAONLYticketType [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with fields

```
fix problems with fields

USAGE
  $ sfnick fonteva:fix:ASAONLYticketType [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/ASAONLYticketType.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/ASAONLYticketType.js)_

## `sfnick fonteva:fix:field -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with fields

```
fix problems with fields

USAGE
  $ sfnick fonteva:fix:field -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/field.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/field.js)_

## `sfnick fonteva:fix:fontevaRecords -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with Fonteva Config records that exist after transfering to a new org

```
fix problems with Fonteva Config records that exist after transfering to a new org

USAGE
  $ sfnick fonteva:fix:fontevaRecords -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/fontevaRecords.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/fontevaRecords.js)_

## `sfnick fonteva:fix:joinProcess -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with Fonteva Join Process records that exist after transfering to a new org

```
fix problems with Fonteva Join Process records that exist after transfering to a new org

USAGE
  $ sfnick fonteva:fix:joinProcess -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/joinProcess.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/joinProcess.js)_

## `sfnick fonteva:fix:priceRule -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with Fonteva Price Rule records that exist after transfering to a new org

```
fix problems with Fonteva Price Rule records that exist after transfering to a new org

USAGE
  $ sfnick fonteva:fix:priceRule -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/priceRule.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/priceRule.js)_

## `sfnick fonteva:fix:priceRuleVariable -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with Fonteva Price Rule Variable records that exist after transfering to a new org

```
fix problems with Fonteva Price Rule Variable records that exist after transfering to a new org

USAGE
  $ sfnick fonteva:fix:priceRuleVariable -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/priceRuleVariable.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/priceRuleVariable.js)_

## `sfnick fonteva:fix:skipLogicRule -s <string> -t <string> [-p <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

fix problems with Fonteva Skip Logic records that exist after transfering to a new org

```
fix problems with Fonteva Skip Logic records that exist after transfering to a new org

USAGE
  $ sfnick fonteva:fix:skipLogicRule -s <string> -t <string> [-p <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --pathoverride=pathoverride                                                   override default config data path
  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username
  -t, --targetorg=targetorg                                                         (required) target org SFDX username
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/fix/skipLogicRule.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/fix/skipLogicRule.js)_

## `sfnick fonteva:modify:field -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify the value of one or more fields on a single object

```
modify the value of one or more fields on a single object

USAGE
  $ sfnick fonteva:modify:field -o <string> -m <string> [-f <string>] [-z] [-t] [-b <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --batchsize=batchsize
      the batch size to use when updating records (default: 200)

  -f, --filter=filter
      modify only records from a specified filter

  -m, --mapping=mapping
      (required) list of FIELD_TO_UPDATE==VALUE pairs, seperated with &&. Add a ** before the value to indicate that the 
      value of another field on the record should be used. Seperate multiple values for a single field with ++

  -o, --object=object
      (required) modify a field on the specified object

  -t, --disabletriggersvalidationrules
      disable all triggers/validation rules before executing destroy operation. Renables triggers/validation rules after 
      execution.

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  -z, --allowprod
      allows modifying records in a production org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob" -f "FirstName = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Account -m "AdditionalPhone==**Phone" -f "AdditionalPhone = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob&&Title==**LastName" -f "FirstName = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob&&Title==**LastName++, ++**FirstName" -f 
  "FirstName = null"
```

_See code: [lib/commands/fonteva/modify/field.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/modify/field.js)_

## `sfnick fonteva:open [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open any org in a web browser

```
open any org in a web browser

USAGE
  $ sfnick fonteva:open [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/open.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/open.js)_

## `sfnick fonteva:open:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open a client's full sandbox org in a web browser

```
open a client's full sandbox org in a web browser

USAGE
  $ sfnick fonteva:open:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/open/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/open/full.js)_

## `sfnick fonteva:open:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open a client's production org in a web browser

```
open a client's production org in a web browser

USAGE
  $ sfnick fonteva:open:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/open/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/open/prod.js)_

## `sfnick fonteva:open:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open a client's uat sandbox org in a web browser

```
open a client's uat sandbox org in a web browser

USAGE
  $ sfnick fonteva:open:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/open/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/open/uat.js)_

## `sfnick fonteva:post:salesorder -o <string> -m <string> [-f <string>] [-z] [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify the value of one or more fields on a single object

```
modify the value of one or more fields on a single object

USAGE
  $ sfnick fonteva:post:salesorder -o <string> -m <string> [-f <string>] [-z] [-t] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --filter=filter
      modify only records from a specified filter

  -m, --mapping=mapping
      (required) list of FIELD_TO_UPDATE==VALUE pairs, seperated with &&. Add a ** before the value to indicate that the 
      value of another field on the record should be used. Seperate multiple values for a single field with ++

  -o, --object=object
      (required) modify a field on the specified object

  -t, --disabletriggersvalidationrules
      disable all triggers/validation rules before executing destroy operation. Renables triggers/validation rules after 
      execution.

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  -z, --allowprod
      allows modifying records in a production org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

EXAMPLES
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob" -f "FirstName = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Account -m "AdditionalPhone==**Phone" -f "AdditionalPhone = null"
  $ sfdx fonteva:modify:field -u scratch-org -o Contact -m "FirstName==Bob&&Title==**LastName" -f "FirstName = null"
```

_See code: [lib/commands/fonteva/post/salesorder.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/post/salesorder.js)_

## `sfnick fonteva:retrieve:dashboards [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all dashboards from target org

```
retrieve all dashboards from target org

USAGE
  $ sfnick fonteva:retrieve:dashboards [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/dashboards.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/dashboards.js)_

## `sfnick fonteva:retrieve:dashboards:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all dashboards from a client's full sandbox org

```
retrieve all dashboards from a client's full sandbox org

USAGE
  $ sfnick fonteva:retrieve:dashboards:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/dashboards/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/dashboards/full.js)_

## `sfnick fonteva:retrieve:dashboards:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all dashboards from a client's production org

```
retrieve all dashboards from a client's production org

USAGE
  $ sfnick fonteva:retrieve:dashboards:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/dashboards/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/dashboards/prod.js)_

## `sfnick fonteva:retrieve:dashboards:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all dashboards from a client's uat sandbox org

```
retrieve all dashboards from a client's uat sandbox org

USAGE
  $ sfnick fonteva:retrieve:dashboards:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/dashboards/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/dashboards/uat.js)_

## `sfnick fonteva:retrieve:data [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all config data from target org

```
retrieve all config data from target org

USAGE
  $ sfnick fonteva:retrieve:data [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/data.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/data.js)_

## `sfnick fonteva:retrieve:documents [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all documents from target org

```
retrieve all documents from target org

USAGE
  $ sfnick fonteva:retrieve:documents [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/documents.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/documents.js)_

## `sfnick fonteva:retrieve:emailTemplates [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all email templates from target org

```
retrieve all email templates from target org

USAGE
  $ sfnick fonteva:retrieve:emailTemplates [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/emailTemplates.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/emailTemplates.js)_

## `sfnick fonteva:retrieve:emailTemplates:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all email templates from a client's full sandbox org

```
retrieve all email templates from a client's full sandbox org

USAGE
  $ sfnick fonteva:retrieve:emailTemplates:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/emailTemplates/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/emailTemplates/full.js)_

## `sfnick fonteva:retrieve:emailTemplates:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all email templates from a client's production org

```
retrieve all email templates from a client's production org

USAGE
  $ sfnick fonteva:retrieve:emailTemplates:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/emailTemplates/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/emailTemplates/prod.js)_

## `sfnick fonteva:retrieve:emailTemplates:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all email templates from a client's uat sandbox org

```
retrieve all email templates from a client's uat sandbox org

USAGE
  $ sfnick fonteva:retrieve:emailTemplates:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/emailTemplates/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/emailTemplates/uat.js)_

## `sfnick fonteva:retrieve:installedPackages [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all installed packages from target org

```
retrieve all installed packages from target org

USAGE
  $ sfnick fonteva:retrieve:installedPackages [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/installedPackages.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/installedPackages.js)_

## `sfnick fonteva:retrieve:managedObjects [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve managed objects from target org. Default namespaces: DRCTS, DonorApi, EventApi, Framework, joinapi, LTE, OrderApi, PagesApi, PriceApi, ProgramApi

```
retrieve managed objects from target org. Default namespaces: DRCTS, DonorApi, EventApi, Framework, joinapi, LTE, OrderApi, PagesApi, PriceApi, ProgramApi

USAGE
  $ sfnick fonteva:retrieve:managedObjects [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/managedObjects.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/managedObjects.js)_

## `sfnick fonteva:retrieve:reports [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all reports from target org

```
retrieve all reports from target org

USAGE
  $ sfnick fonteva:retrieve:reports [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/reports.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/reports.js)_

## `sfnick fonteva:retrieve:reports:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all reports from a client's full sandbox org

```
retrieve all reports from a client's full sandbox org

USAGE
  $ sfnick fonteva:retrieve:reports:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/reports/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/reports/full.js)_

## `sfnick fonteva:retrieve:reports:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all reports from a client's production org

```
retrieve all reports from a client's production org

USAGE
  $ sfnick fonteva:retrieve:reports:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/reports/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/reports/prod.js)_

## `sfnick fonteva:retrieve:reports:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all reports from a client's uat sandbox org

```
retrieve all reports from a client's uat sandbox org

USAGE
  $ sfnick fonteva:retrieve:reports:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/reports/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/reports/uat.js)_

## `sfnick fonteva:retrieve:workflows [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all workflows from target org

```
retrieve all workflows from target org

USAGE
  $ sfnick fonteva:retrieve:workflows [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/workflows.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/workflows.js)_

## `sfnick fonteva:retrieve:workflows:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all workflows from a client's full sandbox org

```
retrieve all workflows from a client's full sandbox org

USAGE
  $ sfnick fonteva:retrieve:workflows:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/workflows/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/workflows/full.js)_

## `sfnick fonteva:retrieve:workflows:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all workflows from a client's production org

```
retrieve all workflows from a client's production org

USAGE
  $ sfnick fonteva:retrieve:workflows:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/workflows/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/workflows/prod.js)_

## `sfnick fonteva:retrieve:workflows:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieve all workflows from a client's uat sandbox org

```
retrieve all workflows from a client's uat sandbox org

USAGE
  $ sfnick fonteva:retrieve:workflows:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/retrieve/workflows/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/retrieve/workflows/uat.js)_

## `sfnick fonteva:secret:set:clientid [-v <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

sets the client id for connecting orgs with Fonteva's CI/CD process

```
sets the client id for connecting orgs with Fonteva's CI/CD process

USAGE
  $ sfnick fonteva:secret:set:clientid [-v <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -v, --value=value                                                                 the client id
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/secret/set/clientid.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/secret/set/clientid.js)_

## `sfnick fonteva:secret:set:clientsecret [-v <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

sets the client secret for connecting orgs with Fonteva's CI/CD process

```
sets the client secret for connecting orgs with Fonteva's CI/CD process

USAGE
  $ sfnick fonteva:secret:set:clientsecret [-v <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -v, --value=value                                                                 the client secret
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/secret/set/clientsecret.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/secret/set/clientsecret.js)_

## `sfnick fonteva:test -s <string> -t <string> [-p <string>] [-d <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

used for testing various functionality. DO NOT USE

```
used for testing various functionality. DO NOT USE

USAGE
  $ sfnick fonteva:test -s <string> -t <string> [-p <string>] [-d <string>] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   override default config data path

  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username

  -t, --targetorg=targetorg                                                         (required) target org SFDX username

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/test.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/test.js)_

## `sfnick fonteva:toggle:triggers [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open any org in a web browser

```
open any org in a web browser

USAGE
  $ sfnick fonteva:toggle:triggers [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/toggle/triggers.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/toggle/triggers.js)_

## `sfnick fonteva:transfer:configData -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

transfer Fonteva config data from a source org to a target org

```
transfer Fonteva config data from a source org to a target org

USAGE
  $ sfnick fonteva:transfer:configData -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   override default config data path

  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username

  -t, --targetorg=targetorg                                                         (required) target org SFDX username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/transfer/configData.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/transfer/configData.js)_

## `sfnick fonteva:transfer:configDataWithId -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

transfer Fonteva config data from a source org to a target org

```
transfer Fonteva config data from a source org to a target org

USAGE
  $ sfnick fonteva:transfer:configDataWithId -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   override default config data path

  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username

  -t, --targetorg=targetorg                                                         (required) target org SFDX username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/transfer/configDataWithId.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/transfer/configDataWithId.js)_

## `sfnick fonteva:transfer:joinProcess -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

transfer Fonteva config data from a source org to a target org

```
transfer Fonteva config data from a source org to a target org

USAGE
  $ sfnick fonteva:transfer:joinProcess -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   override default config data path

  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username

  -t, --targetorg=targetorg                                                         (required) target org SFDX username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/transfer/joinProcess.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/transfer/joinProcess.js)_

## `sfnick fonteva:transfer:sparkAdmin -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

transfer Fonteva config data from a source org to a target org

```
transfer Fonteva config data from a source org to a target org

USAGE
  $ sfnick fonteva:transfer:sparkAdmin -s <string> -t <string> [-p <string>] [-d <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --productiondomain=productiondomain                                           the domain of the production org.
                                                                                    required if migrating data to a
                                                                                    production org

  -p, --pathoverride=pathoverride                                                   override default config data path

  -s, --sourceorg=sourceorg                                                         (required) source org SFDX username

  -t, --targetorg=targetorg                                                         (required) target org SFDX username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/transfer/sparkAdmin.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/transfer/sparkAdmin.js)_

## `sfnick fonteva:validate [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

validate (check-only deploy) all force-app metadata in any org

```
validate (check-only deploy) all force-app metadata in any org

USAGE
  $ sfnick fonteva:validate [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/validate.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/validate.js)_

## `sfnick fonteva:validate:full [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

validate (check-only deploy) all force-app metadata in a client's full sandbox org

```
validate (check-only deploy) all force-app metadata in a client's full sandbox org

USAGE
  $ sfnick fonteva:validate:full [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/validate/full.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/validate/full.js)_

## `sfnick fonteva:validate:prod [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

validate (check-only deploy) all force-app metadata in a client's production org

```
validate (check-only deploy) all force-app metadata in a client's production org

USAGE
  $ sfnick fonteva:validate:prod [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/validate/prod.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/validate/prod.js)_

## `sfnick fonteva:validate:uat [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

validate (check-only deploy) all force-app metadata in a client's uat sandbox org

```
validate (check-only deploy) all force-app metadata in a client's uat sandbox org

USAGE
  $ sfnick fonteva:validate:uat [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --client=client                                                               name or acronym of the client
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/fonteva/validate/uat.js](https://github.com/nicholasglesmann/sfnick/blob/v0.0.5/lib/commands/fonteva/validate/uat.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
