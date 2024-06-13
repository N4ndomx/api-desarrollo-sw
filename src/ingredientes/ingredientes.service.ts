import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingrediente } from './entities/ingrediente.entity';
import { DataSource, Repository } from 'typeorm';
import { Estados_Entidades } from 'src/shared/helpers/estado-producto.enum';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private ingredientRepository: Repository<Ingrediente>,
    private readonly dataSourse: DataSource
  ) { }
  async create(createIngredienteDto: CreateIngredienteDto) {
    const ingredient = this.ingredientRepository.create({ ...createIngredienteDto });
    return await this.ingredientRepository.save(ingredient);
  }

  async findAll() {
    return await this.ingredientRepository.find();
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientRepository.findOneBy({ id_ingrediente: id });
    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }
    return ingredient;
  }

  async update(id: string, updateIngredienteDto: UpdateIngredienteDto) {
    const { stock, agregar_stock, ...data } = updateIngredienteDto

    const ing = await this.findOne(id)
    let nuevoStok: number = ing.stock
    if (agregar_stock) {
      nuevoStok = nuevoStok + agregar_stock
    } else if (stock >= 0) {
      console.log("nuevo ")
      nuevoStok = stock
    }
    const ingrediente = await this.ingredientRepository.preload({
      id_ingrediente: id,
      ...data,
      stock: nuevoStok
    })
    const res = await this.ingredientRepository.save(ingrediente)
    return res


  }

  async remove(id: string) {
    const rest = await this.update(id, { estado: Estados_Entidades.INACTIVO })
    return "Ingrediente Inabilitado"
  }
}
