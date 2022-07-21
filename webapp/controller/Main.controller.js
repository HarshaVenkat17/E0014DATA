sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "../model/formatter",
    "sap/ui/core/Fragment"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, Dialog, Button, ButtonType, MessageBox, JSONModel, FilterOperator, Filter, formatter, Fragment) {
        "use strict";
        return Controller.extend("e0014data.controller.Main", {
            formatter: formatter,
            onInit: function () 
            {
                // E0014 Consumption
                // var myList=this.getView().byId("idHeaderPanel");                 
                // var oBinding = myList.getBinding("items");
                // var vornr = '0020';
                // var aufnr = '11000989';
                // if (oBinding) {
                //     var oFilters = [new sap.ui.model.Filter("Vornr", sap.ui.model.FilterOperator.EQ, vornr),
                //                     new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, aufnr)];
                //     var filterObj = new sap.ui.model.Filter(oFilters, true);
                //     oBinding.filter(filterObj); 
                //     } 
                // else {
                //     oBinding.filter([]);
                // }

                // this._getBinding();
                 const oCompModel = new JSONModel({
                     item:[
                        {
                        "Matnr":'4000108',
                        "ReqQty": "3000", 
                        "WithQty": "2500",
                        "OpenQty": "500", 
                        "ReqUom": "ST", 
                        "WithUom": "ST",
                        "OpenUom": "ST", 
                        "comp": [
                            {
                                Status: "POSTED", Batch: "500Z06", HU: "100000233423333",
                                ExpDate: "03/10/2023", BfDiff: "", ConQty: "2400"
                            },
                            {
                                Status: "POSTED", Batch: "500Z06", HU: "100000233423333",
                                ExpDate: "03/10/2024", BfDiff: "", ConQty: "100"
                            }

                        ],
                        "stock" : [{
                                  Location:"PSA02-BIN-01",Batch:"1000000610",ExpDate:"08/04/2022",
                                    HU:"",ConQty: "100.000"	
                        },
                        {
                                  Location:"PSA02-BIN-01",Batch:"1000000580",ExpDate:"03/12/2021",
                                    HU:"",ConQty: "60.000"	
                        },
                        {
                                  Location:"PSA02-BIN-01",Batch:"1000000740",ExpDate:"09/06/2023",
                                    HU:"",ConQty: "120.000"	
						}
                    ]},
                     {
                        "Matnr":'400108',
                        "ReqQty": "3000", 
                        "WithQty": "500",
                        "OpenQty": "2500", 
                        "ReqUom": "ST", 
                        "WithUom": "ST",
                        "OpenUom": "ST", 
                        "comp": [
                            {
                                Status: "POSTED", Batch: "500Z06", HU: "100000333",
                                ExpDate: "03/12/2023", BfDiff: "", ConQty: "24"
                            },
                            {
                                Status: "POSTED", Batch: "500Z06", HU: "100000333",
                                ExpDate: "03/01/2022", BfDiff: "", ConQty: "24"
                            }
                        ],
                        "stock" : [{
                                  Location:"PSA02-BIN-01",Batch:"1000000610",ExpDate:"08/04/2022",
                                    HU:"",ConQty: "9.000"	
                        },
                        {
                                  Location:"PSA02-BIN-01",Batch:"1000000580",ExpDate:"03/12/2021",
                                    HU:"",ConQty: "5.000"	
                        },
                        {
                                  Location:"PSA02-BIN-01",Batch:"1000000740",ExpDate:"09/06/2023",
                                    HU:"",ConQty: "12.000"	
						}
                    ]}
                ]
                });
                
                
                for(let k=0; k<oModel.getProperty('/item').length;k++)
                {
                    var total=parseFloat(0);
                    var arr=[];
                    var count=oModel.getProperty('/item/'+k+'/comp');
                    count=count.length;
                    for(let i=0; i<count; i++)
                    {
                        total=total+parseFloat(oModel.getProperty('/item/'+k+'/comp/'+i+'/ConQty'));
                        arr.push(oModel.getProperty('/item/'+k+'/comp/'+i+'/ExpDate'));
                    }
                    // remove while conversion
                    for (let i in arr){
                        arr[i]=new Date(arr[i].split("/"));
                    }
                    arr.sort(function(a,b){
                        return (a - b);
                    });
                    var d = new Date(arr[0]);
                    var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
                    if (month.length < 2) 
                        month = '0' + month;
                    if (day.length < 2) 
                        day = '0' + day;

                    var expDate= [month, day, year].join('/');
            
                    var o={
                        Status: "TOTAL", Batch: '', HU: count,
                        ExpDate: expDate, BfDiff: "", ConQty: String(total)
                    };
                    //ExpDate=min(all expdates)
                    oModel.getProperty('/item/'+k+'/comp').push(o);
                    oModel.refresh();
                } 
                //E0014 Readiness
                const oSmartTable = this.byId(Fragment.createId("idReadinessFrag", "idOperationSummary"));
                if (oSmartTable) {
                    oSmartTable.rebindTable();
                    
                }
            },
       
            //E0014 Readiness
            
            /**
             * @description get the filters on the home screen
             * @private
             */
            _getFilters: function () {
                const aFilters = [];
                aFilters.push(new Filter({
                    path: "Aufnr",
                    operator: FilterOperator.EQ,
                    value1: "11000989"
                }));

                aFilters.push(new Filter({
                    path: "Vornr",
                    operator: FilterOperator.EQ,
                    value1: "0020"
                }));

               
                return new Filter({
                    filters: aFilters,
                    and: true
                })
            },

            /**
             * @description on beforeRebindTable event called 
             * @param {sap.ui.base.Event} oEvent of the control 
             * @public
             */
            onBeforeRebindTable: function (oEvent) {
                const binding = oEvent.getParameter("bindingParams");
                const aFilters = this._getFilters();
                binding.filters.push(aFilters);
            },

            //e0014 Consumption tab,
            onOverflowToolbarPress: function () {
                var oPanel = this.byId("idHeaderPanel");
                oPanel.setExpanded(!oPanel.getExpanded());
            },
           onReset: function(){
                var json=this.getView().getModel("ConsumptionModel").getProperty("/item");
                for(let i=0; i<json.length;i++){
                    var sample=json[i]["comp"];
                    for(let j=0; j<sample.length;j++){
                        if(sample[j]["Status"]=="PENDING")
                        {sample[j]["ConQty"]="0";}
                    }
                    this.onChange(-1);
                }
                this.getView().getModel("ConsumptionModel").refresh();
           },
            onAddConsumption: function (matnr) {
                var oView= this.getView();
                if (!this.oCreateDialog) {
        
                    this.oCreateDialog = new Dialog({
                        title: "Add Consumption Item Details",
                        contentWidth: "550px",
                        contentHeight: "300px",
                        content: new sap.ui.layout.form.SimpleForm({
                            minWidth: 1024, maxContainerCols: 2,
                            editable: true, layout: "ResponsiveGridLayout",
                            labelSpanL: 3, labelSpanM: 3, emptySpanL: 4, emptySpanM: 4, columnsL: 1, columnsM: 1,
                            content: [
                                new sap.m.Label({ text: "{i18n>handlingUnit}" }),
                                new sap.m.Input({ value: "{HU}", id: "idHUInput" }),
                                new sap.m.Label({ text: "{i18n>batch}" }),
                                new sap.m.Input({ value: "{Batch}", id: "idBatch1Input" }),
                                new sap.m.Label({ text: "{i18n>material}" }),
                                new sap.m.Input({ value: "{Material}", id: "idMaterialInput", editable:false}),
                                new sap.m.Label({ text: "{i18n>consQty}" }),
                                new sap.m.Input({ value: "50", id: "idConQtyInput" , editable:false}),
                                new sap.m.Label({ text: "{i18n>expnDate}" }),
                                new sap.m.DatePicker({ value: "03/01/2021", id: "idExpDateInput", editable:false}),
                                new sap.m.Label({ text: "{i18n>location}" }),
                                new sap.m.Input({ value: "TANK-1", id: "idStorageLocInput" , editable:false}),
                            ]
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Save",
                            press: function (oEvent) {
                                var flag=0, count, index, total=parseFloat(0);
                                var search=['idBatch1Input' ];
                                var BatchInp=sap.ui.getCore().byId('idBatch1Input').getValue();
                                var HUInp=sap.ui.getCore().byId('idHUInput').getValue();
                                var ExpDateInp=sap.ui.getCore().byId('idExpDateInput').getValue();
                                var ConQtyInp=sap.ui.getCore().byId('idConQtyInput').getValue();
                                
                                var oModel=this.getView().getModel("ConsumptionModel");
                                if (BatchInp || HUInp){
                                    
                                    var oItem={
                                        Status: "PENDING", Batch: BatchInp, HU: HUInp,
                                        ExpDate: ExpDateInp, BfDiff: "", ConQty: ConQtyInp
                                    };
                                    // change
                                    var json=this.getView().getModel("ConsumptionModel").getProperty("/item");
                                    for(let i=0; i<json.length;i++){
                                        var search=json[i]["Matnr"];
                                        if(matnr==search){
                                            index=i;
                                            var getItems=json[i]["comp"];
                                            count=getItems.length-1;
                                            for(let k=0;k<count;k++){
                                                if(getItems[k]["Status"]=="PENDING")
                                                {
                                                    total=total+parseFloat(getItems[k]["ConQty"]);
                                                }
                                            }
                                                break;
                                        }
                                    }
                                    total = this.setStockQuantity(oItem,index,total);   
                                    oModel.refresh();
                                    this.oCreateDialog.close();
                                    this.onChange(index);
                                }
                            }.bind(this)                   
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oCreateDialog.close();
                            }.bind(this)
                        })
                    });

                    //to get access to the controller's model
                    this.getView().addDependent(this.oCreateDialog);
                }

                this.oCreateDialog.open();
            },
           
            onPSAPopoverSelect: function (oEvent,matnr) 
            {   
                var oView = this.getView(); 
                var that =this;
                var oMatnrData = new JSONModel({ "Matnr": matnr });
                oView.setModel(oMatnrData, 'MatnrModel');

                if (!this._pPSADialog) 
                { 
                    this._pPSADialog = Fragment.load(
                                        {   id: oView.getId(), 
                                            name: "e0014data.fragments.StockSelection", 
                                            controller: this })
                                            .then(function (oDialog) {
                                                oView.addDependent(oDialog); 
                                                
                                                // var myTable= oView.byId("idStockTable");
                                                // var oBinding = myTable.getBinding("items");
                                                // var aufnr = '11000989';
                                                // var vornr='0020';
                                                // that.getConsumptionData(aufnr,vornr).then(oStockData => {
                                                //     that.setModel(new JSONModel(oStockData), "ConsumptionModel");
                                                //     that.getModel().refresh();
                                                //     // that.getView().getModel("ConsumptionModel").setData(oStockData);
                                                  
                                                // });
                                                // if (oBinding) {
                                                //     var oFilters = [ new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, matnr),
                                                //                      new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, aufnr)];
                                                //     var filterObj = new sap.ui.model.Filter(oFilters, true);
                                                //     oBinding.filter(filterObj); 
                                                //     } 
                                                // else {
                                                //     oBinding.filter([]);
                                                // }
                                                return oDialog;
                                        }); 
                }                     
                this._pPSADialog.then(function (oDialog) { oDialog.open() }); 
            },
            
            onCloseDialog:function(e){
                e.getSource().getParent().close()},
            //change: add stock to item table
            onAddStock:function(e,matnr){
                var that=this;
                var index, count, total=parseFloat(0);
                const aTable=this.byId("idStockTable").getSelectedItems();
                var oModel=this.getView().getModel("ConsumptionModel");
                var json=this.getView().getModel("ConsumptionModel").getProperty("/item");
                for(let j=0; j<json.length;j++){
                    var search=json[j]["Matnr"];
                    if(matnr==search){
                        index=j;
                        var getItems=json[j]["comp"];
                        count=getItems.length-1;
                        for(let k=0;k<count;k++){
                            if(getItems[k]["Status"]=="PENDING")
                            {
                                total=total+parseFloat(getItems[k]["ConQty"]);
                            }
                        }
                        break;
                    }
                }
                
                for(let i=0;i<aTable.length;i++){
                    var path=aTable[i].getBindingContextPath();
                    var oItem=Object.assign({},this.getView().getModel("ConsumptionModel").getProperty(path));
                    oItem.Status="PENDING";                         
                    total=this.setStockQuantity(oItem,index,total);
                }

                oModel.refresh();
                this.onCloseDialog(e);
                this.onChange(index);
            },
          
            setStockQuantity:function(oItem,index,total){                
                var oModel=this.getView().getModel("ConsumptionModel");
                var checkQty=parseFloat(oModel.getProperty('/item/'+index+'/OpenQty'));
                var setQty = parseFloat(oItem.ConQty);
                var check=checkQty-total;
                if(check==0){
                    setQty=0;
                }
                else if(check<=setQty){
                    setQty=check;
                }
                total=total+setQty;
                oItem.ConQty=String(setQty);
                var oTemp=oModel.getProperty('/item/'+index+'/comp').pop();
                oModel.getProperty('/item/'+index+'/comp').push(oItem);
                oModel.getProperty('/item/'+index+'/comp').push(oTemp);
                return total;
            },
            onChange: function(index)
            {            
                var oModel=this.getView().getModel('ConsumptionModel');
                if(index>=0)
                {
                        var k=index;
                        var total=parseFloat(0);
                        var arr=[];
                        var count=oModel.getProperty('/item/'+k+'/comp');
                        count=count.length-1;
                        for(let i=0; i<count; i++)
                        {
                            total=total+parseFloat(oModel.getProperty('/item/'+k+'/comp/'+i+'/ConQty'));
                            arr.push(oModel.getProperty('/item/'+k+'/comp/'+i+'/ExpDate'));
                        }
                        for (let i in arr){
                            arr[i]=new Date(arr[i].split("/"));
                        }
                        arr.sort(function(a,b){
                            return (a - b);
                        });
                        var d = new Date(arr[0]);
                        var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
                        if (month.length < 2) 
                            month = '0' + month;
                        if (day.length < 2) 
                            day = '0' + day;

                        var expDate= [month, day, year].join('/');

                        oModel.setProperty('/item/'+k+'/comp/'+count+'/ConQty',total);
                        oModel.setProperty('/item/'+k+'/comp/'+count+'/HU',count);
                        oModel.setProperty('/item/'+k+'/comp/'+count+'/ExpDate',expDate); 
                }
                else
                {
                    for(let k=0; k<oModel.getProperty('/item').length;k++)
                    {
                        var total=parseFloat(0);
                        var arr=[];
                        var count=oModel.getProperty('/item/'+k+'/comp');
                        count=count.length-1;
                        for(let i=0; i<count; i++)
                        {
                            total=total+parseFloat(oModel.getProperty('/item/'+k+'/comp/'+i+'/ConQty'));
                            arr.push(oModel.getProperty('/item/'+k+'/comp/'+i+'/ExpDate'));
                        }
                        for (let i in arr){
                            arr[i]=new Date(arr[i].split("/"));
                        }
                        arr.sort(function(a,b){
                            return (a - b);
                        });
                        var d = new Date(arr[0]);
                        var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
                        if (month.length < 2) 
                            month = '0' + month;
                        if (day.length < 2) 
                            day = '0' + day;

                        var expDate= [month, day, year].join('/');

                        oModel.setProperty('/item/'+k+'/comp/'+count+'/ConQty',total);
                        oModel.setProperty('/item/'+k+'/comp/'+count+'/HU',count);
                        oModel.setProperty('/item/'+k+'/comp/'+count+'/ExpDate',expDate);
                    } 
                }
                oModel.refresh();
            },

            //E0013 Confirmation tab     
            onAddConfirmation: function () {
                if (!this.oCreateDialog) {
                    // oView = this.getView();
                    this.oCreateDialog = new Dialog({
                        title: "Add Confirmation Item Details",
                        contentWidth: "550px",
                        contentHeight: "300px",
                        content: new sap.ui.layout.form.SimpleForm({
                            id: "idAddYieldForm", minWidth: 1024, maxContainerCols: 2,
                            editable: true, layout: "ResponsiveGridLayout",
                            labelSpanL: 3, labelSpanM: 3, emptySpanL: 4, emptySpanM: 4, columnsL: 1, columnsM: 1,
                            content: [
                                new sap.m.Label({ text: "Yield" }),
                                new sap.m.Input({ value: "{LMNGA}", id: "idYieldInput" }),
                                new sap.m.Label({ text: "Scrap" }),
                                new sap.m.Input({ value: "{XMNGA}", id: "idScrapInput" }),
                                new sap.m.Label({ text: "Reason Code" }),
                                new sap.m.Input({ value: "{GRUND}", id: "idReasonInput" }),
                            ]
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Save",
                            press: function () {
                                if (sap.ui.getCore().byId('idYieldInput').getValue()) {
                                    if (sap.ui.getCore().byId('idScrapInput').getValue()) {
                                        if (sap.ui.getCore().byId('idReasonInput').getValue()) { this.oCreateDialog.close(); }
                                    }
                                }
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oCreateDialog.close();
                            }.bind(this)
                        })
                    });

                    //to get access to the controller's model
                    this.getView().addDependent(this.oCreateDialog);
                }

                this.oCreateDialog.open();
            },
        })

    });

