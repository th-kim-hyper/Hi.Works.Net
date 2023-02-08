﻿/**
*
* @libraryType DotNetDll
* @id b6e6e9ee-c5a8-4d2a-8924-26b65db0a47e
* @targetMethodType Static_Method
* @targetAssembly IPA.Custom.ExtendLibrary.dll
* @targetClassName RPAGO.Custom.ExtendLibrary.DataConverter_DateTime
* @targetMethodName DateFormat
* @targetMethodFullName System.Object DateFormat(System.Object, System.String)
* @methodDisplayName System.Object DateFormat(System.Object, System.String)
* @createdDate 2020-05-26 13:50:08
* @lastModifiedDate 2020-05-26 13:50:08
* @createdBy archi.lee
* @lastModifiedBy archi.lee
*
* @designerVersion 1.6.500.07311
* @brief 
*  @brf 
* @param date<String_DateTime> (ex, '2020-01-01 13:00:00')
* @param format<String> (ex, 'dddd, dd MMMM yyyy HH:mm:ss')
*
*/

if(Script.DataConverter == undefined || Script.DataConverter == null) {
	Script.DataConverter = new Object();
}

if(Script.DataConverter.DateTime_DateFormat == null || Script.DataConverter.DateTime_DateFormat == undefined) {
	Script.DataConverter.DateTime_DateFormat = function (instance, date, format) {

/*hide*/Bot.AddHostType("RPAGO_Custom_ExtendLibrary_DataConverter_DateTime", "RPAGO.Custom.ExtendLibrary.DataConverter_DateTime", Global.AssemblyDir + 'IPA.Custom.ExtendLibrary.dll');
/*hide*/var pluginModule = (!instance) ? Bot.CreateInstance(Global.AssemblyDir + 'IPA.Custom.ExtendLibrary.dll', "RPAGO.Custom.ExtendLibrary.DataConverter_DateTime", "System.Object DateFormat(System.Object, System.String)") : instance;
/*hide*/var plugin = new PlugInDll(pluginModule, "System.Object DateFormat(System.Object, System.String)", "DotNetDll");

	//Body Begin
		plugin.SetPropValue("date", date);
		plugin.SetPropValue("format", format);
		
	//Body End

/*hide*/return plugin.Run();
	}
}