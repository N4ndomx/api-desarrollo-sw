import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CreateTarifaDTO } from "src/servicios/dto/tarifas.dto";

@ValidatorConstraint({ name: ' tipoFacturacionUnico' })
export class tipoFacturacionUnico implements ValidatorConstraintInterface {
    validate(value: CreateTarifaDTO[], validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const tiposFacturacion = new Set<string>();
        for (const tarifa of value) {
            if (tiposFacturacion.has(tarifa.unidad_facturacion)) {
                return false; // Si encuentra un tipo de facturación repetido, devuelve falso
            }
            tiposFacturacion.add(tarifa.unidad_facturacion);
        }
        return true;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return "La unidad de Facturacion no debe ser la misma "
    }

}