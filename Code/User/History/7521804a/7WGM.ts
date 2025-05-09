import { reactive, ref, shallowRef } from "vue";
import { IField } from "@/@core/interfaces/genericForms";
import CompanyItem from "@/@core/components/items/CompanyItem.vue";
import { useTenantController } from "@/tenant/controller/tenantController";
import { IProfile } from "@/profile/entities/profile";

const tenantController = useTenantController();

const fields = reactive<IField[]>([
      {
        label: "Empresas",
        md: 12,
        model: "tenants",
        cols: 12,
        type: "searchAutocomplete",
        value: null,
        items: [],
        multiple: true,
        itemValue: "id",
        itemTitle: "name",
        chips: true,
        itemComponent: shallowRef(CompanyItem),
        searchFunction: tenantController.searchTenants
      },
    ]);

const initialData = ref<IProfile>({
  id: "",
  name: "",
  tenants: [],
  color: "",
  system_profile: false,
  menu_items: []
})

export function useCreateReportComposable() {
    
return {
    fields,
  };
}
