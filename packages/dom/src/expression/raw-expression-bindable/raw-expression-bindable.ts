import {HostIdentifier, ForeignIdentifier, ExpressionIsAsync} from "@fovea/common";

// An Expression where the arguments and foreign identifiers can be wrapped and altered
export declare type RawExpressionBindable = [(knownTemplateVariables: string[], ...argNames: string[]) => string, (knownTemplateVariables: string[], ...additionalHostIdentifiers: HostIdentifier[]) => HostIdentifier[], (...templateVariables: string[]) => ForeignIdentifier[], ExpressionIsAsync];