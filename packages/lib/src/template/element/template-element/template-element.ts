import {ITemplateNormalElement} from "../template-normal-element/i-template-normal-element";
import {ITemplateConditionalElement} from "../template-conditional-element/i-template-conditional-element";
import {ITemplateMultiElement} from "../template-multi-element/i-template-multi-element";

export declare type TemplateElement = ITemplateNormalElement|ITemplateConditionalElement|ITemplateMultiElement;