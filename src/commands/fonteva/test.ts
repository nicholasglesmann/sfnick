import { SfdxCommand, flags } from '@salesforce/command';
import { Messages } from '@salesforce/core';
// import { OperationType, OrgDMLOperation } from '../../shared/OrgDMLOperation';
// import { OrgDMLOperator } from '../../shared/OrgDMLOperator';
// import MigrationField from '../../shared/metadata/MigrationField';
// import MigrationFieldCreatorService from '../../shared/metadata/MigrationFieldCreatorService';
// import OrgService from '../../shared/OrgService';
// import PromiseService from '../../shared/PromiseService';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfnick', 'fon');

export default class Test extends SfdxCommand
{
    public static description = messages.getMessage('test.description');
    public static examples = [];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        sourceorg: flags.string({
            char: 's',
            required: true,
            description: messages.getMessage('transfer.configData.flags.sourceorg')
        }),
        targetorg: flags.string({
            char: 't',
            required: true,
            description: messages.getMessage('transfer.configData.flags.targetorg')
        }),
        pathoverride: flags.string({
            char: 'p',
            required: false,
            description: messages.getMessage('transfer.configData.flags.pathoverride')
        }),
        productiondomain: flags.string({
            char: 'd',
            required: false,
            description: messages.getMessage('transfer.configData.flags.productiondomain')
        })
    };

    public async run(): Promise<any>
    {
        // let conn = await OrgService.getConnFromUsername(this.flags.targetusername);

//         let mapping = {
// 260000:	260402,
// 260001:	260403,
// 260002:	260404,
// 260003:	260405,
// 260004:	260406,
// 260005:	260407,
// 260006:	260408,
// 260007:	260409,
// 260008:	260410,
// 260010:	260412,
// 260011:	260413,
// 260013:	260415,
// 260014:	260416,
// 260015:	260417,
// 260016:	260418,
// 260017:	260419,
// 260018:	260420,
// 260019:	260421,
// 260020:	260422,
// 260021:	260423,
// 260022:	260424,
// 260023:	260425,
// 260024:	260426,
// 260025:	260427,
// 260026:	260428,
// 260028:	260430,
// 260029:	260431,
// 260030:	260432,
// 260031:	260433,
// 260032:	260434,
// 260033:	260435,
// 260034:	260436,
// 260035:	260437,
// 260036:	260438,
// 260037:	260439,
// 260038:	260440,
// 260039:	260441,
// 260040:	260442,
// 260041:	260443,
// 260042:	260444,
// 260043:	260445,
// 260044:	260446,
// 260045:	260447,
// 260046:	260448,
// 260047:	260449,
// 260048:	260450,
// 260049:	260451,
// 260051:	260453,
// 260052:	260454,
// 260053:	260455,
// 260054:	260456,
// 260055:	260457,
// 260056:	260458,
// 260057:	260459,
// 260058:	260460,
// 260059:	260461,
// 260060:	260462,
// 260061:	260463,
// 260062:	260464,
// 260063:	260465,
// 260064:	260466,
// 260065:	260467,
// 260066:	260468,
// 260067:	260469,
// 260068:	260470,
// 260069:	260471,
// 260070:	260472,
// 260071:	260473,
// 260074:	260476,
// 260075:	260477,
// 260076:	260478,
// 260077:	260479,
// 260078:	260480,
// 260079:	260481,
// 260080:	260482,
// 260081:	260483,
// 260082:	260484,
// 260083:	260485,
// 260084:	260486,
// 260085:	260487,
// 260086:	260488,
// 260087:	260489,
// 260088:	260490,
// 260089:	260491,
// 260091:	260493,
// 260093:	260495,
// 260094:	260496,
// 260095:	260497,
// 260096:	260498,
// 260097:	260499,
// 260098:	260500,
// 260099:	260501,
// 260100:	260502,
// 260101:	260503,
// 260102:	260504,
// 260103:	260505,
// 260104:	260506,
// 260105:	260507,
// 260106:	260508,
// 260108:	260510,
// 260109:	260511,
// 260110:	260512,
// 260111:	260513,
// 260112:	260514,
// 260113:	260515,
// 260115:	260517,
// 260116:	260518,
// 260117:	260519,
// 260118:	260520,
// 260119:	260521,
// 260120:	260522,
// 260121:	260523,
// 260122:	260524,
// 260123:	260525,
// 260124:	260526,
// 260125:	260527,
// 260126:	260528,
// 260127:	260529,
// 260128:	260530,
// 260129:	260531,
// 260130:	260532,
// 260131:	260533,
// 260132:	260534,
// 260133:	260535,
// 260134:	260536,
// 260135:	260537,
// 260136:	260538,
// 260137:	260539,
// 260138:	260540,
// 260139:	260541,
// 260140:	260542,
// 260141:	260543,
// 260143:	260545,
// 260144:	260546,
// 260146:	260548,
// 260147:	260549,
// 260148:	260550,
// 260149:	260551,
// 260150:	260552,
// 260151:	260553,
// 260152:	260554,
// 260153:	260555,
// 260154:	260556,
// 260155:	260557,
// 260156:	260558,
// 260157:	260559,
// 260158:	260560,
// 260159:	260561,
// 260160:	260562,
// 260161:	260563,
// 260162:	260564,
// 260163:	260565,
// 260164:	260566,
// 260165:	260567,
// 260166:	260568,
// 260167:	260569,
// 260168:	260570,
// 260169:	260571,
// 260170:	260572,
// 260171:	260573,
// 260173:	260575,
// 260174:	260576,
// 260175:	260577,
// 260176:	260578,
// 260177:	260579,
// 260178:	260580,
// 260179:	260581,
// 260180:	260582,
// 260181:	260583,
// 260182:	260584,
// 260183:	260585,
// 260184:	260586,
// 260185:	260587,
// 260187:	260589,
// 260188:	260590,
// 260189:	260591,
// 260190:	260592,
// 260191:	260593,
// 260192:	260594,
// 260193:	260595,
// 260194:	260596,
// 260195:	260597,
// 260196:	260598,
// 260197:	260599,
// 260198:	260600,
// 260199:	260601,
// 260200:	260602,
// 260201:	260603,
// 260202:	260604,
// 260203:	260605,
// 260204:	260606,
// 260205:	260607,
// 260206:	260608,
// 260207:	260609,
// 260208:	260610,
// 260209:	260611,
// 260210:	260612,
// 260211:	260613,
// 260212:	260614,
// 260213:	260615,
// 260214:	260616,
// 260215:	260617,
// 260216:	260618,
// 260217:	260619,
// 260218:	260620,
// 260219:	260621,
// 260220:	260622,
// 260221:	260623,
// 260222:	260624,
// 260223:	260625,
// 260224:	260626,
// 260225:	260627,
// 260226:	260628,
// 260227:	260629,
// 260228:	260630,
// 260229:	260631,
// 260230:	260632,
// 260231:	260633,
// 260232:	260634,
// 260233:	260635,
// 260234:	260636,
// 260235:	260637,
// 260236:	260638,
// 260237:	260639,
// 260238:	260640,
// 260239:	260641,
// 260240:	260642,
// 260241:	260643,
// 260242:	260644,
// 260243:	260645,
// 260244:	260646,
// 260402: 260000,
// 260403: 260001,
// 260404: 260002,
// 260405: 260003,
// 260406: 260004,
// 260407: 260005,
// 260408: 260006,
// 260409: 260007,
// 260410: 260008,
// 260412: 260010,
// 260413: 260011,
// 260415: 260013,
// 260416: 260014,
// 260417: 260015,
// 260418: 260016,
// 260419: 260017,
// 260420: 260018,
// 260421: 260019,
// 260422: 260020,
// 260423: 260021,
// 260424: 260022,
// 260425: 260023,
// 260426: 260024,
// 260427: 260025,
// 260428: 260026,
// 260430: 260028,
// 260431: 260029,
// 260432: 260030,
// 260433: 260031,
// 260434: 260032,
// 260435: 260033,
// 260436: 260034,
// 260437: 260035,
// 260438: 260036,
// 260439: 260037,
// 260440: 260038,
// 260441: 260039,
// 260442: 260040,
// 260443: 260041,
// 260444: 260042,
// 260445: 260043,
// 260446: 260044,
// 260447: 260045,
// 260448: 260046,
// 260449: 260047,
// 260450: 260048,
// 260451: 260049,
// 260453: 260051,
// 260454: 260052,
// 260455: 260053,
// 260456: 260054,
// 260457: 260055,
// 260458: 260056,
// 260459: 260057,
// 260460: 260058,
// 260461: 260059,
// 260462: 260060,
// 260463: 260061,
// 260464: 260062,
// 260465: 260063,
// 260466: 260064,
// 260467: 260065,
// 260468: 260066,
// 260469: 260067,
// 260470: 260068,
// 260471: 260069,
// 260472: 260070,
// 260473: 260071,
// 260476: 260074,
// 260477: 260075,
// 260478: 260076,
// 260479: 260077,
// 260480: 260078,
// 260481: 260079,
// 260482: 260080,
// 260483: 260081,
// 260484: 260082,
// 260485: 260083,
// 260486: 260084,
// 260487: 260085,
// 260488: 260086,
// 260489: 260087,
// 260490: 260088,
// 260491: 260089,
// 260493: 260091,
// 260495: 260093,
// 260496: 260094,
// 260497: 260095,
// 260498: 260096,
// 260499: 260097,
// 260500: 260098,
// 260501: 260099,
// 260502: 260100,
// 260503: 260101,
// 260504: 260102,
// 260505: 260103,
// 260506: 260104,
// 260507: 260105,
// 260508: 260106,
// 260510: 260108,
// 260511: 260109,
// 260512: 260110,
// 260513: 260111,
// 260514: 260112,
// 260515: 260113,
// 260517: 260115,
// 260518: 260116,
// 260519: 260117,
// 260520: 260118,
// 260521: 260119,
// 260522: 260120,
// 260523: 260121,
// 260524: 260122,
// 260525: 260123,
// 260526: 260124,
// 260527: 260125,
// 260528: 260126,
// 260529: 260127,
// 260530: 260128,
// 260531: 260129,
// 260532: 260130,
// 260533: 260131,
// 260534: 260132,
// 260535: 260133,
// 260536: 260134,
// 260537: 260135,
// 260538: 260136,
// 260539: 260137,
// 260540: 260138,
// 260541: 260139,
// 260542: 260140,
// 260543: 260141,
// 260545: 260143,
// 260546: 260144,
// 260548: 260146,
// 260549: 260147,
// 260550: 260148,
// 260551: 260149,
// 260552: 260150,
// 260553: 260151,
// 260554: 260152,
// 260555: 260153,
// 260556: 260154,
// 260557: 260155,
// 260558: 260156,
// 260559: 260157,
// 260560: 260158,
// 260561: 260159,
// 260562: 260160,
// 260563: 260161,
// 260564: 260162,
// 260565: 260163,
// 260566: 260164,
// 260567: 260165,
// 260568: 260166,
// 260569: 260167,
// 260570: 260168,
// 260571: 260169,
// 260572: 260170,
// 260573: 260171,
// 260575: 260173,
// 260576: 260174,
// 260577: 260175,
// 260578: 260176,
// 260579: 260177,
// 260580: 260178,
// 260581: 260179,
// 260582: 260180,
// 260583: 260181,
// 260584: 260182,
// 260585: 260183,
// 260586: 260184,
// 260587: 260185,
// 260589: 260187,
// 260590: 260188,
// 260591: 260189,
// 260592: 260190,
// 260593: 260191,
// 260594: 260192,
// 260595: 260193,
// 260596: 260194,
// 260597: 260195,
// 260598: 260196,
// 260599: 260197,
// 260600: 260198,
// 260601: 260199,
// 260602: 260200,
// 260603: 260201,
// 260604: 260202,
// 260605: 260203,
// 260606: 260204,
// 260607: 260205,
// 260608: 260206,
// 260609: 260207,
// 260610: 260208,
// 260611: 260209,
// 260612: 260210,
// 260613: 260211,
// 260614: 260212,
// 260615: 260213,
// 260616: 260214,
// 260617: 260215,
// 260618: 260216,
// 260619: 260217,
// 260620: 260218,
// 260621: 260219,
// 260622: 260220,
// 260623: 260221,
// 260624: 260222,
// 260625: 260223,
// 260626: 260224,
// 260627: 260225,
// 260628: 260226,
// 260629: 260227,
// 260630: 260228,
// 260631: 260229,
// 260632: 260230,
// 260633: 260231,
// 260634: 260232,
// 260635: 260233,
// 260636: 260234,
// 260637: 260235,
// 260638: 260236,
// 260639: 260237,
// 260640: 260238,
// 260641: 260239,
// 260642: 260240,
// 260643: 260241,
// 260644: 260242,
// 260645: 260243,
// 260646: 260244
//         };


//         let contactRecords = await OrgService.queryRecords('SELECT Id, Name, Email, CreatedDate, APNA_Contact_ID__c FROM Contact WHERE APNA_Contact_ID__c != null ORDER BY APNA_Contact_ID__c', conn);

//         let recordsToUpdate = [];

//         let counts = {};

//         for (let i = 0; i < contactRecords.length; i++)
//         {
//             if (counts[contactRecords[i].APNA_Contact_ID__c])
//             {
//                 let oldId = contactRecords[i].APNA_Contact_ID__c;
//                 contactRecords[i].APNA_Contact_ID__c = mapping[contactRecords[i].APNA_Contact_ID__c];
//                 recordsToUpdate.push(contactRecords[i]);

//                 let originalId = oldId > contactRecords[i].APNA_Contact_ID__c ? contactRecords[i].APNA_Contact_ID__c : oldId;

//                 console.log(`${contactRecords[i].Id}; ${contactRecords[i].CreatedDate}; ${contactRecords[i].Name}; ${contactRecords[i].Email}; ${contactRecords[i].APNA_Contact_ID__c}; ${oldId}; ${originalId}`);

//                 delete contactRecords[i].Name;
//                 continue;
//             }

//             counts[contactRecords[i].APNA_Contact_ID__c] = 1;
//         }

//         console.log(`${recordsToUpdate.length} Contact records will be updated`);

        // let orgDmlOperator = new OrgDMLOperator(conn, 'Contact');
        // orgDmlOperator.run(OperationType.update, recordsToUpdate);


        // contactCountsGreaterThan1.forEach(record =>
        // {
        //     let oldAPNAId = record.APNA_Contact_ID__c;

        //     if (oldAPNAId == 652)
        //     {
        //         record.APNA_Contact_ID__c = '260400';
        //     }
        //     else if (oldAPNAId == 252589)
        //     {
        //         record.APNA_Contact_ID__c = '260401';
        //     }
        //     else
        //     {
        //         record.APNA_Contact_ID__c = Number(oldAPNAId) + 402;
        //     }

        //     console.log(`Contact ${record.Id}: Old APNA Id: ${oldAPNAId} - New APNA Id: ${record.APNA_Contact_ID__c}`);
        // });



        // let userRecords = await OrgService.queryRecords('SELECT Id, Fon_APNA_Contact_ID__c, Contact.APNA_Contact_Id__c FROM User WHERE Fon_APNA_Contact_ID__c != null ORDER BY CreatedDate DESC', conn);

        // let userCountsGreaterThan1 = [];

        // for (let i = 0; i < userRecords.length; i++)
        // {
        //     if (userRecords[i]?.Contact?.APNA_Contact_Id__c && userRecords[i].FON_APNA_Contact_Id__c != userRecords[i]?.Contact?.APNA_Contact_Id__c)
        //     {
        //         userCountsGreaterThan1.push(userRecords[i]);
        //     }
        // }

        // console.log(userCountsGreaterThan1.length);

        // let orgDmlOperator = new OrgDMLOperator(conn, 'User');
        // orgDmlOperator.batchSize = 50;
        // await orgDmlOperator.run(OperationType.update, userCountsGreaterThan1);

        // userCountsGreaterThan1.forEach(record =>
        // {
        //     if (record.FON_APNA_Contact_Id__c != record?.Contact?.APNA_Contact_ID__c)
        //     {
        //         record.FON_APNA_Contact_Id__c = record?.Contact?.APNA_Contact_ID__c;
        //     }


        //     console.log(record);

        //     // userCountsGreaterThan1.push(record);
        //     // console.log(`User ${record.Id}: Old APNA Id: ${oldAPNAId} - New APNA Id: ${record.FON_APNA_Contact_Id__c}`);
        // });



        // for (let recordId in counts)
        // {
        //     if (counts[recordId] > 1)
        //     {
        //         countsGreaterThan1.push(recordId);
        //         console.log(`APNA Id ${recordId} has ${counts[recordId]} records`);
        //     }
        // }

        // console.log(contactCountsGreaterThan1.length);
        // console.log(userCountsGreaterThan1.length);






















        // conn.tooling.executeAnonymous("System.debug('Check');", function(err, res){
        //     if (err) { return console.error(err); }
        //     console.log(res);
        // });

        // conn.tooling.query("SELECT Id, Application, DurationMilliseconds, Location, LogLength, LogUserId, Operation, Request, RequestIdentifier, StartTime, Status FROM ApexLog", null, function(err, res){
        //     if (err) { return console.error(err); }
        //     console.log(res);
        // });


        // conn.tooling.sobject('ApexLog').find('Select Id, LogUserId, LogLength, LastModifiedDate, Request, Operation, Application, Status, DurationMilliseconds, SystemModstamp, StartTime, Location FROM ApexLog', [])
        // .execute({}, (err, res) =>
        // {
        //     if (err) { console.log(err); }
        //     console.log(res);
        // });







        // let fieldNames = ['Account','Contact'];

        // await MigrationFieldCreatorService.createMigrationFields(conn, fieldNames);

        // let migrationField = new MigrationField('OrderApi__Sales_Order__c');
        // console.log(migrationField.toPlainObject());
    }
}
