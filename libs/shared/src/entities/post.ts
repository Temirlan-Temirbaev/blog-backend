import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @Column({ type: "timestamptz", nullable: true })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.posts)
  author: User;
  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: "CASCADE" })
  comments: Comment[];
  @Column({ default: "" })
  image: string;
}
