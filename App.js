Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var lookback = 30;
        var startDate = new Date(new Date() - 86400000*lookback).toISOString(); //millisecondsInDay = 86400000
        
        var filters = [
            {
                property : 'LastUpdateDate',
                operator : '>=',
                value : startDate
            }	
   	];
        var artifacts = Ext.create('Rally.data.wsapi.artifact.Store', {
            models: ['UserStory','Defect'],
            fetch: ['FormattedID','Name','Feature'],
            autoLoad: true,
            filters : filters,
            listeners: {
		    load: this._onDataLoaded,
		    scope: this
                 }
        });
    },
    _onDataLoaded: function(store, data) {
        this._customRecords = [];
        _.each(data, function(artifact, index) {
            this._customRecords.push({
                _ref: artifact.get('_ref'),
                FormattedID: artifact.get('FormattedID'),
                Name: artifact.get('Name'),
                Feature: artifact.get('Feature')
            });
        }, this);
       this._createGrid(store,data);
    },
    _createGrid: function(store,data){
            var that = this;
            var g = Ext.create('Rally.ui.grid.Grid', {
                itemId: 'mygrid',
   		store: store,
                enableEditing: false,
                showRowActionsColumn: false,
                columnCfgs: [
                    {text: 'Formatted ID', dataIndex: 'FormattedID'},
                    {text: 'Name', dataIndex: 'Name'},
                    {
                        text: 'Feature', dataIndex: 'Feature',
                             renderer: function(value){
                            if (value) {
                                return value.FormattedID + ':' + value._refObjectName;
                            }
                            else{
                                return 'None';
                            }
                        }
                    }
                ],
        height: 400
   	});
   	this.add(g); 
   }
});
