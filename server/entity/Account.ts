import { ObjectType } from "type-graphql";
import { plainToClass } from "class-transformer";

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  Generated,
  OneToMany,
} from "typeorm";

import { IAccount, IAccountProfile, AccountVIPLevel } from "../graphql/Account";

import Record from "./Record";

import { ACCOUNT_TYPE } from "../utils/constants";

@ObjectType({ implements: IAccountProfile })
export class AccountProfile extends BaseEntity implements IAccountProfile {
  @Column({ nullable: true, comment: "账号头像" })
  avatar!: string;

  @Column({ nullable: true, comment: "自我介绍" })
  selfIntro!: string;

  @Column({
    default: AccountVIPLevel.NON_VIP,
    comment: "账号VIP等级",
  })
  VIPLevel!: AccountVIPLevel;

  @Column({ default: false, comment: "自我介绍" })
  isLifeTimeVIP!: boolean;
}

const ACCOUNT_PROFILE_DEFAULT = plainToClass(AccountProfile, {
  avatar: "",
  selfIntro: "",
  VIPLevel: AccountVIPLevel.NON_VIP,
  isLifeTimeVIP: false,
});

@ObjectType({ implements: IAccount })
@Entity()
export default class Account extends BaseEntity implements IAccount {
  // 账号基本信息
  @PrimaryGeneratedColumn()
  accountId!: number;

  @Column()
  @Generated("uuid")
  accountUUID!: string;

  @Column({ unique: true, comment: "账号名称" })
  accountName!: string;

  @Column({ comment: "账号密码" })
  accountPwd!: string;

  @Column({ default: true, comment: "账号是否可用" })
  accountAvaliable!: boolean;

  @Column({
    default: JSON.stringify(ACCOUNT_PROFILE_DEFAULT),
    comment: "账号资料",
  })
  accountProfile!: string;

  @Column({
    default: ACCOUNT_TYPE.VISITOR,
    comment: "账号类型",
    enum: ACCOUNT_TYPE,
  })
  accountType!: ACCOUNT_TYPE;

  // 记录
  @OneToMany((type) => Record, (record) => record.recordAccount, {
    cascade: true,
    nullable: true,
  })
  relatedRecord!: Record[];

  @RelationId((account: Account) => account.relatedRecord)
  relatedRecordId?: number[];

  @CreateDateColumn({ comment: "注册时间" })
  registryDate!: Date;

  @UpdateDateColumn({ comment: "更新时间" })
  lastUpdateDate!: Date;
}