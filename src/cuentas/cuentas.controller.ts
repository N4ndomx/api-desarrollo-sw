import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { AgregarProductosDTO } from './dto/agregar-prod-cuenta.dto';
import { AgregarServiciosDTO } from './dto/agregar-serv-cuenta.dto';

@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) { }

  @Post()
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentasService.create(createCuentaDto);
  }
  @Post("add/productos")
  agregarProductos(@Body() addProductos: AgregarProductosDTO) {
    return this.cuentasService.agregarProductos(addProductos);
  }
  @Post("add/servicios")
  agregarServ(@Body() addService: AgregarServiciosDTO) {
    return this.cuentasService.agregarServicio(addService);
  }

  @Get('pagar/p/:idcuenta')
  pagar_soloProductos(@Param('idcuenta', ParseUUIDPipe) idcuenta: string) {
    return this.cuentasService.pagar_soloProductos(idcuenta);
  }

  @Get('pagar/s/:idcuenta')
  pagar_soloServic(@Param('idcuenta', ParseUUIDPipe) idcuenta: string) {
    return this.cuentasService.pagar_soloServicios(idcuenta);
  }



  @Get()
  findAll() {
    return this.cuentasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuentasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuentaDto: UpdateCuentaDto) {
    return this.cuentasService.update(+id, updateCuentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuentasService.remove(+id);
  }
}
