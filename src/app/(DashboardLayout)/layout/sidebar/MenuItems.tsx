import { uniqueId } from "lodash";
interface MenuitemsType {
    [x: string]: any;
    id?: string;
    navlabel?: boolean;
    subheader?: string;
    title?: string;
    icon?: any;
    href?: string;
    children?: MenuitemsType[];
    bgcolor?: any;
    chip?: string;
    chipColor?: string;
    variant?: string;
    external?: boolean;
}

const Menuitems: MenuitemsType[] = [
    {
        navlabel: true,
        subheader: "HOME",
    },

    {
        id: uniqueId(),
        title: "Dashboard",
        icon: "screencast-2-line-duotone",
        href: "/",
    },

    {
        id: uniqueId(),
        title: "Residentes",
        icon: "users-line-duotone",
        href: "/residentes",
    },

    {
        id: uniqueId(),
        title: "Vehiculos",
        icon: "users-line-duotone",
        href: "/vehiculos",
    },

    {
        id: uniqueId(),
        title: "Categorias",
        icon: "users-line-duotone",
        href: "/categorias",
    },

    {
        id: uniqueId(),
        title: "Viviendas",
        icon: "users-line-duotone",
        href: "/viviendas",
    },

    {
        id: uniqueId(),
        title: "Guardias",
        icon: "users-line-duotone",
        href: "/guardias",
    },

    {
        id: uniqueId(),
        title: "Areas Comunes",
        icon: "users-line-duotone",
        href: "/areas-comunes",
    },

    {
        id: uniqueId(),
        title: "Comunicados",
        icon: "users-line-duotone",
        href: "/comunicados",
    },

    {
        id: uniqueId(),
        title: "Copropietarios",
        icon: "users-line-duotone",
        href: "/copropietarios",
    },

    {
        id: uniqueId(),
        title: "Expensas",
        icon: "users-line-duotone",
        href: "/expensas",
    },

    {
        navlabel: true,
        subheader: "AUTH",
    },
    {
        id: uniqueId(),
        title: "Login",
        icon: "login-2-broken",
        href: "/authentication/login",
    },

];

export default Menuitems;
