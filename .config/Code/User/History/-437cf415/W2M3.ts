const menus = [

    {
        title: 'Administração',
        icon: 'ri-shield-user-line',
        children: [
            {
                title: 'Empresas',
                to: 'tenants',
            },
            {
                title: "Funcionários",
                to: 'employees',
            },
            {
                title: "Clientes",
                to: "clients"
            },
            {
                title: "Perfis",
                to: "profiles"
            },
            {
                title: "Grupos",
                to: "groups"
            }
        ],
    },
    {
        title: "Gestão",
        icon: "ri-home-2-line",
        children: [
            {
                title: "Minha Clínica",
                to: "my-clinic",
            },
            {
                title: "Dashboard",
                to: "dashboard",
            },
            {
                title: "Serviços",
                to: "services",
            },
            {
                title: "Planos",
                to: "plans"
            }
        ]
    },
    {
        title: "Sessões",
        icon: "ri-calendar-line",
        children: [
            {
                title: "Sessões",
                to: "sessions",
            },
        ]
    },
    {
        title: "Financeiro",
        icon: "ri-money-dollar-circle-line",
        children: [
            {
                title: "Serviços",
                to: "cash-services"
            },
            {
                title: "Caixa",
                to: "cash-register"
            },
            {
                title: "Formas de pagamento",
                to: "payment-methods"
            }
        ]
    },
    {
        title: "Relatórios",
        icon: "ri-file-chart-line",
        children: [
            {
                title: "Relatorio de Clientes",
                to: "reports-clients",
            },
        ]
    }
]

export default menus;