/*Configure permission code*/
export const ActionCode = {
  /*Tab operation opens details*/
  TabsDetail: 'default:feat:tabs:example-detail',
  /*Tab operation opens details*/
  SearchTableDetail: 'default:page-demo:search-table:example-detail',

  /*System Management*/
  AccountAdd: 'default:system:account:add', // Account management added
  AccountEdit: 'default:system:account:edit', // Account ManagementEdit
  AccountDel: 'default:system:account:del', // Account management delete

  /*role management*/
  RoleManagerAdd: 'default:system:role-manager:add', // New role management
  RoleManagerEdit: 'default:system:role-manager:edit', // Role management editor
  RoleManagerDel: 'default:system:role-manager:del', // Role management delete
  RoleManagerSetRole: 'default:system:role-manager:set-role', // Role management set roles

  /*Menu management*/
  MenuAdd: 'default:system:menu:add', // Menu new
  MenuEdit: 'default:system:menu:edit', // menu edit
  MenuDel: 'default:system:menu:del', // menu delete
  MenuAddLowLevel: 'default:system:menu:addlowlevel', // Add submenu

  /*Department management*/
  DeptAdd: 'default:system:dept:add', // Added department management
  DeptEdit: 'default:system:dept:edit', // Department Management Editor
  DeptDel: 'default:system:dept:del', // Department management delete
  DeptAddLowLevel: 'default:system:dept:addlowlevel' // Add subordinates in department management
};
