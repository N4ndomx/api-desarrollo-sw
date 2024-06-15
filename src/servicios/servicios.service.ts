import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { DataSource, Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifas.entity';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    @InjectRepository(Tarifa)
    private readonly tarifaRepository: Repository<Tarifa>,
    private readonly dataSourse: DataSource
  ) { }
  async create(createServicioDto: CreateServicioDto) {
    const { tarifas, ...data } = createServicioDto

    const servicio = this.servicioRepository.create(

      {
        ...data,
        tarifas: tarifas.map(tar => this.tarifaRepository.create({ ...tar }))
      }
    )
    const res = await this.servicioRepository.save(servicio)
    return res

  }

  async findAll() {

    return await this.servicioRepository.find();
  }

  async findOne(id: string) {
    const serv = await this.servicioRepository.findOneBy({ id_service: id })
    if (!serv) throw new NotFoundException(`Servicio no encotrado`);
    return serv
  }

  async update(id: string, updateServicioDto: UpdateServicioDto) {
    const { tarifas, ...data } = updateServicioDto
    const queryRuner = this.dataSourse.createQueryRunner() // Puede ejecutar varias instrucciones sql que impactaran la bd pero si alg falla
    await queryRuner.connect() //Inicia coneccion a la bd
    await queryRuner.startTransaction()
    try {

      const serv = await this.servicioRepository.preload({
        id_service: id,
        ...data
      })
      if (!serv) throw new Error(`Servicio no encotrado `);


      if (tarifas) {
        await queryRuner.manager.delete(Tarifa, { servicio: { id_service: id } })
        serv.tarifas = tarifas.map(tar => this.tarifaRepository.create({ ...tar }))
      }

      const resp = await queryRuner.manager.save(serv)
      await queryRuner.commitTransaction() // Inicia el impacto a bd con el save y delete  
      return resp
    } catch (error) {
      await queryRuner.rollbackTransaction()
      throw new BadRequestException(error.message)
    } finally {
      await queryRuner.release()
    }

  }

  async remove(id: string) {
    const data = await this.findOne(id);
    await this.servicioRepository.remove(data);
    return `Eliminacion exitosa de servicio ${data.nombre}`;
  }


}
