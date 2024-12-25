import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Input for the aggregateData query. */
export type AggregateInput = {
  /** Optional filter criteria to be applied on the aggregated data. */
  filter?: InputMaybe<Scalars['String']['input']>;
  /** List of service identifiers to fetch and aggregate data from. */
  serviceIds: Array<Scalars['String']['input']>;
};

/** Result of the aggregateData query. */
export type AggregateResult = {
  __typename?: 'AggregateResult';
  /** Aggregated data from the requested services. */
  data: Array<AggregatedItem>;
  /** Metadata about the aggregation process (e.g., processing time). */
  metadata?: Maybe<AggregationMetadata>;
  /** Unique request identifier for tracking this aggregation task. */
  requestId: Scalars['ID']['output'];
};

/** Representation of a single item in the aggregated data. */
export type AggregatedItem = {
  __typename?: 'AggregatedItem';
  /** Data fetched from this source. */
  content: Scalars['String']['output'];
  /** Identifier of the data source (service). */
  source: Scalars['String']['output'];
};

/** Metadata about the aggregation result. */
export type AggregationMetadata = {
  __typename?: 'AggregationMetadata';
  /** Time (in milliseconds) taken to process the aggregation. */
  processingTimeMs?: Maybe<Scalars['Int']['output']>;
  /** Total number of services processed. */
  serviceCount: Scalars['Int']['output'];
};

/** Queries available in the aggregator. */
export type Query = {
  __typename?: 'Query';
  /** Aggregates data from multiple services and creates a combined result. */
  aggregateData: AggregateResult;
};


/** Queries available in the aggregator. */
export type QueryAggregateDataArgs = {
  input: AggregateInput;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AggregateInput: AggregateInput;
  AggregateResult: ResolverTypeWrapper<AggregateResult>;
  AggregatedItem: ResolverTypeWrapper<AggregatedItem>;
  AggregationMetadata: ResolverTypeWrapper<AggregationMetadata>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AggregateInput: AggregateInput;
  AggregateResult: AggregateResult;
  AggregatedItem: AggregatedItem;
  AggregationMetadata: AggregationMetadata;
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Query: {};
  String: Scalars['String']['output'];
};

export type AggregateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateResult'] = ResolversParentTypes['AggregateResult']> = {
  data?: Resolver<Array<ResolversTypes['AggregatedItem']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['AggregationMetadata']>, ParentType, ContextType>;
  requestId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregatedItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedItem'] = ResolversParentTypes['AggregatedItem']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregationMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregationMetadata'] = ResolversParentTypes['AggregationMetadata']> = {
  processingTimeMs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serviceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  aggregateData?: Resolver<ResolversTypes['AggregateResult'], ParentType, ContextType, RequireFields<QueryAggregateDataArgs, 'input'>>;
};

export type Resolvers<ContextType = any> = {
  AggregateResult?: AggregateResultResolvers<ContextType>;
  AggregatedItem?: AggregatedItemResolvers<ContextType>;
  AggregationMetadata?: AggregationMetadataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

