/**
 * Created by doug on 7/14/14.
 */

Ext.define('DynaPackage.view.Navigation', {
    extend: 'Ext.toolbar.Toolbar',
    requires : [
        'Ext.toolbar.Toolbar',
        'Ext.button.Split'
    ],

    xtype: 'app-navigator',

    items : [
        '->',
        {
            xtype : 'splitbutton',
            text : 'Actions',
            menu : [
                {
                    text : 'General Ledger',
                    moduleAction : 'general-ledger'
                },
                {
                    text : 'General Ledger (fr)',
                    moduleAction : 'general-ledger-fr'
                }
            ]
        }
    ]
});