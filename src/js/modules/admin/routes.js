import RootPage from '@/js/components/RootPage';

const routes = function() {
  return [{
    path: '/admin',
    name: 'AdminIndex.vue',
    component: () =>
      import('./views/AdminIndex'),
    meta: {
      title: 'Администрирование',
      icon: 'admin',
      description: 'Управление учетными записями пользователей, ролями, настройками и просмотр журналов работы.',
      to: 'Index.vue',
      sidebar: true,
      nobreadcrumbs: true,
      redirectTo: {
        name: 'UsersList.vue'
      },
      permissions: [
        'USERS_VIEW',
        'USERS_EDIT',
        'ROLES_VIEW',
        'ROLES_EDIT',
        'HELP_EDIT',
        'LOG_VIEW',
        'PO_SSMP_TEST'
      ]
    },
    children: [{
      path: 'users',
      name: 'UsersIndex.vue',
      component: RootPage,
      meta: {
        title: 'Учетные записи пользователей',
        url: 'admin/users',
        redirectTo: {
          name: 'UsersList.vue'
        },
        sidebar: true,
        permissions: ['USERS_VIEW', 'USERS_EDIT']
      },
      children: [{
        path: 'list',
        name: 'UsersList.vue',
        helpKey: 'USER',
        component: () =>
          import('./views/Users/UsersList'),
        meta: {
          helpKey:'USER',
          title: 'Учетные записи пользователей',
          text: 'Список учетных записей пользователей',
          permissions: ['USERS_VIEW', 'USERS_EDIT']
        }
      },
      {
        path: 'create',
        name: 'UsersCreate.vue',
        helpKey: 'USER',
        component: () =>
          import('./views/Users/UsersCreate'),
        meta: {
          helpKey:'USER',
          permissions: ['USERS_EDIT'],
          title: 'Добавление учетной записи пользователя'
        }
      },
      {
        path: 'edit/:id',
        name: 'UsersEdit.vue',
        helpKey: 'USER',
        component: () =>
          import('./views/Users/UsersEdit'),
        meta: {
          helpKey:'USER',
          permissions: ['USERS_VIEW', 'USERS_EDIT'],
          title: 'Редактирование учетной записи пользователя'
        }
      },
      {
        path: 'view/:id',
        name: 'UsersView.vue',
        helpKey: 'USER',
        component: () =>
          import('./views/Users/UsersView'),
        meta: {
          helpKey:'USER',
          permissions: ['USERS_VIEW'],
          title: 'Просмотр учетной записи пользователя'
        }
      }
      ]
    },
    {
      path: 'roles',
      name: 'RolesIndex.vue',
      component: RootPage,
      meta: {
        title: 'Роли',
        url: 'admin/roles',
        redirectTo: {
          name: 'RolesList.vue'
        },
        sidebar: true,
        permissions: ['ROLES_VIEW', 'ROLES_EDIT']
      },
      children: [{
        path: 'list',
        name: 'RolesList.vue',
        helpKey: 'ROLE',
        component: () =>
          import('./views/Roles/RolesList'),
        meta: {
          helpKey:'ROLE',
          permissions: ['ROLES_VIEW', 'ROLES_EDIT'],
          title: 'Роли',
          text: 'Список ролей'
        }
      },
      {
        path: 'create',
        name: 'RolesCreate.vue',
        helpKey: 'ROLE',
        component: () =>
          import('./views/Roles/RolesCreate'),
        meta: {
          helpKey:'ROLE',
          permissions: ['ROLES_EDIT'],
          title: 'Добавление роли'
        }
      },
      {
        path: 'edit/:id',
        name: 'RolesEdit.vue',
        helpKey: 'ROLE',
        component: () =>
          import('./views/Roles/RolesEdit'),
        meta: {
          helpKey:'ROLE',
          permissions: ['ROLES_VIEW', 'ROLES_EDIT'],
          title: 'Редактирование роли'
        }
      },
      {
        path: 'view/:id',
        name: 'RolesView.vue',
        helpKey: 'ROLE',
        component: () =>
          import('./views/Roles/RolesView'),
        meta: {
          helpKey:'ROLE',
          permissions: ['ROLES_VIEW', 'ROLES_EDIT'],
          title: 'Просмотр роли'
        }
      }
      ]
    },
    {
      path: 'settings',
      name: 'Settings.vue',
      helpKey: 'SSMP_TEST',
      component: () => import('./views/Settings'),
      meta: {
        helpKey:'SSMP_TEST',
        permissions: ['PO_SSMP_TEST'],
        title: 'Сервисный доступ к ПО ССМП',
        text: 'Настройка сервисного доступа к ПО ССМП',
        url: 'admin/settings',
        sidebar: true
      }
    },
    {
      path: 'nss',
      name: 'NssTest.vue',
      helpKey: 'NSS_TEST',
      component: () => import('./views/NssTest'),
      meta: {
        permissions: ['PO_SSMP_TEST'],
        title: 'Сервисный доступ к ПО НСС',
        text: 'Настройка сервисного доступа к ПО НСС',
        url: 'admin/nss',
        sidebar: true
      }
    },
    {
      path: 'helps',
      name: 'EditorForm.vue',
      helpKey: 'HELP',
      component: () => import('./views/Help/EditorForm'),
      meta: {
        helpKey:'HELP',
        permissions: ['HELP_EDIT'],
        title: 'Справочная информация',
        url: 'admin/helps',
        sidebar: true
      }
    },
    {
      path: 'journal',
      name: 'Journal.vue',
      helpKey: 'LOG',
      component: () => import('./views/Journal'),
      meta: {
        helpKey:'LOG',
        permissions: ['LOG_VIEW', 'LOG_EDIT'],
        title: 'Журнал работы',
        url: 'admin/journal',
        sidebar: true
      }
    },
    {
      path: 'journal-delete',
      name: 'JournalDeleteForm.vue',
      helpKey: 'LOG',
      component: () => import('./views/JournalDeleteForm'),
      meta: {
        helpKey:'LOG',
        permissions: ['LOG_EDIT'],
        title: 'Очистка журнала работы',
        text: 'Очистка журнала работы',
        url: 'admin/journal-delete'
      }
    }
    ]
  }];
};

export {
  routes
};

export default routes;
