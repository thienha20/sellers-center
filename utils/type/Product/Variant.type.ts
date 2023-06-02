
type Variant = {
    code: string,
    name: string,
    variant_id: string,
}

type VariantGroup = {
    name: string,
    variants : Variant[],
}

export type {Variant, VariantGroup}
