export interface IOptimizerResult {
	optimized: true|false;
}

export interface IOptimizerNoOptimizationResult extends IOptimizerResult {
	optimized: false;
}

export interface IOptimizerOptimizationResult extends IOptimizerResult {
	optimized: true;
	buffer: Buffer;
}

export declare type OptimizerResult = IOptimizerNoOptimizationResult|IOptimizerOptimizationResult;