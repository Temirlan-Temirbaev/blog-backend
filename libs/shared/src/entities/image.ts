import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  imageId: number;
  @Column()
  filePath: string;
  @Column()
  fileName: string;
}
