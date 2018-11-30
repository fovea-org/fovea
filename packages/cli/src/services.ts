import {DIContainer} from "@wessberg/di";
import {CreateTaskWrapper, ICreateTask} from "./task/create-task/i-create-task";
import {CreateTask} from "./task/create-task/create-task";
import {ICreateCommand} from "./command/create-command/i-create-command";
import {CreateCommand} from "./command/create-command/create-command";
import {ICommandContainer} from "./command/i-command-container";
import {CommandContainer} from "./command/command-container";
import {IProjectPathUtil} from "./util/project-path-util/i-project-path-util";
import {ProjectPathUtil} from "./util/project-path-util/project-path-util";
import {IBuildConfig} from "./build-config/i-build-config";
import {IPathUtil, PathUtil} from "@wessberg/pathutil";
import {FileSaver, IFileSaver} from "@wessberg/filesaver";
import {FileLoader, IFileLoader} from "@wessberg/fileloader";
import {IFormatter} from "./formatter/i-formatter";
import {Formatter} from "./formatter/formatter";
import {BuildTaskWrapper, IBuildTask} from "./task/build-task/i-build-task";
import {BuildTask} from "./task/build-task/build-task";
import {IBuildCommand} from "./command/build-command/i-build-command";
import {BuildCommand} from "./command/build-command/build-command";
import {foveaCliConfigNormalizeFunction} from "./fovea-cli-config/fovea-cli-config-normalize-function";
import {NormalizeFunction} from "./normalize/normalize-function";
import {IFoveaCliConfig, IFoveaCliConfigWithAppName} from "./fovea-cli-config/i-fovea-cli-config";
import {IPackageJson} from "./package-json/i-package-json";
import {packageJsonNormalizeFunction} from "./package-json/package-json-normalize-function";
import {tsconfigNormalizeFunction} from "./tsconfig/tsconfig-normalize-function";
import {PackageJsonUserOptions} from "./package-json/package-json-user-options";
import {buildConfig} from "./build-config/build-config";
import {IPackageJsonNormalizeFunctionConfig} from "./package-json/i-package-json-normalize-function-config";
import {FoveaStyles, IFoveaStyles} from "@fovea/style";
import {IEnvironmentDefaults} from "./environment/i-environment-defaults";
import {environmentDefaultsNormalizeFunction} from "./environment/environment-defaults-normalize-function";
import {ITsconfig} from "./tsconfig/i-tsconfig";
import {IHasherService} from "./service/hasher/i-hasher-service";
import {HasherService} from "./service/hasher/hasher-service";
import {ITslintConfiguration} from "./tslint/i-tslint-configuration";
import {tslintNormalizeFunction} from "./tslint/tslint-normalize-function";
import {gitignoreNormalizeFunction} from "./gitignore/gitignore-normalize-function";
import {IGitignore} from "./gitignore/i-gitignore";
import {INpmignore} from "./npmignore/i-npmignore";
import {npmignoreNormalizeFunction} from "./npmignore/npmignore-normalize-function";
import {ILoggerService} from "./service/logger/i-logger-service";
import {LoggerService} from "./service/logger/logger-service";
import {IBundlerService} from "./service/bundler/i-bundler-service";
import {BundlerService} from "./service/bundler/bundler-service";
// @ts-ignore
import * as BufferSerializer from "buffer-serializer";
import {IBufferSerializer} from "./buffer-serializer/i-buffer-serializer";
import {IManifestJsonWriterService} from "./service/writer/manifest-json-writer/i-manifest-json-writer-service";
import {ManifestJsonWriterService} from "./service/writer/manifest-json-writer/manifest-json-writer-service";
import {IIndexHtmlWriterService} from "./service/writer/index-html-writer/i-index-html-writer-service";
import {IndexHtmlWriterService} from "./service/writer/index-html-writer/index-html-writer-service";
import {IAssetWriterService} from "./service/writer/asset-writer/i-asset-writer-service";
import {AssetWriterService} from "./service/writer/asset-writer/asset-writer-service";
import {IBabelMinifyOptions} from "./service/minify/i-babel-minify-options";
import {babelMinifyOptions} from "./service/minify/babel-minify-options";
import {BrotliEncodeParams} from "iltorb";
import {ZlibOptions} from "zlib";
import {brotliCompressionOptions} from "./service/compression/brotli-compression-options";
import {zlibCompressionOptions} from "./service/compression/zlib-compression-options";
import {ICompressorService} from "./service/compression/i-compressor-service";
import {CompressorService} from "./service/compression/compressor-service";
import {IThrottleUtil} from "./util/throttle-util/i-throttle-util";
import {ThrottleUtil} from "./util/throttle-util/throttle-util";
import {IRollupService} from "./service/rollup/rollup-service/i-rollup-service";
import {RollupService} from "./service/rollup/rollup-service/rollup-service";
import {IAssetOptimizerService} from "./service/asset-optimizer/i-asset-optimizer-service";
import {AssetOptimizerService} from "./service/asset-optimizer/asset-optimizer-service";
import {FileTypeDetectorService} from "./service/file-type-detector/file-type-detector-service";
import {IFileTypeDetectorService} from "./service/file-type-detector/i-file-type-detector-service";
import {ISharpImageOptimizer} from "./service/asset-optimizer/image-optimizer/sharp-image-optimizer/i-sharp-image-optimizer";
import {SharpImageOptimizer} from "./service/asset-optimizer/image-optimizer/sharp-image-optimizer/sharp-image-optimizer";
import {SvgoImageOptimizer} from "./service/asset-optimizer/image-optimizer/svgo-image-optimizer/svgo-image-optimizer";
import {ISvgoImageOptimizer} from "./service/asset-optimizer/image-optimizer/svgo-image-optimizer/i-svgo-image-optimizer";
import {IIcoImageOptimizer} from "./service/asset-optimizer/image-optimizer/ico-image-optimizer/i-ico-image-optimizer";
import {IcoImageOptimizer} from "./service/asset-optimizer/image-optimizer/ico-image-optimizer/ico-image-optimizer";
import {CombinedImageOptimizer} from "./service/asset-optimizer/image-optimizer/combined-image-optimizer/combined-image-optimizer";
import {IImageOptimizer} from "./service/asset-optimizer/image-optimizer/i-image-optimizer";
import {IBabelMinifyOptimizer} from "./service/asset-optimizer/script-optimizer/babel-minify-optimizer/i-babel-minify-optimizer";
import {BabelMinifyOptimizer} from "./service/asset-optimizer/script-optimizer/babel-minify-optimizer/babel-minify-optimizer";
import {CombinedScriptOptimizer} from "./service/asset-optimizer/script-optimizer/combined-script-optimizer/combined-script-optimizer";
import {IScriptOptimizer} from "./service/asset-optimizer/script-optimizer/i-script-optimizer";
import {IConfigParserService} from "./service/parser/config-parser/i-config-parser-service";
import {ConfigParserService} from "./service/parser/config-parser/config-parser-service";
import {PackageJsonParserService} from "./service/parser/package-json-parser/package-json-parser-service";
import {IPackageJsonParserService} from "./service/parser/package-json-parser/i-package-json-parser-service";
import {IStylesParserService} from "./service/parser/styles-parser/i-styles-parser-service";
import {StylesParserService} from "./service/parser/styles-parser/styles-parser-service";
import {IManifestJsonParserService} from "./service/parser/manifest-json-parser/i-manifest-json-parser-service";
import {ManifestJsonParserService} from "./service/parser/manifest-json-parser/manifest-json-parser-service";
import {IIndexHtmlParserService} from "./service/parser/index-html-parser/i-index-html-parser-service";
import {IndexHtmlParserService} from "./service/parser/index-html-parser/index-html-parser-service";
import {IProjectParserService} from "./service/parser/project-parser/i-project-parser-service";
import {ProjectParserService} from "./service/parser/project-parser/project-parser-service";
import {IPackageJsonGenerator} from "./service/generator/package-generator/i-package-json-generator";
import {PackageJsonGenerator} from "./service/generator/package-generator/package-json-generator";
import {EnvironmentGenerator} from "./service/generator/environment-generator/environment-generator";
import {IEnvironmentGenerator} from "./service/generator/environment-generator/i-environment-generator";
import {IConfigGenerator} from "./service/generator/config-generator/i-config-generator";
import {ConfigGenerator} from "./service/generator/config-generator/config-generator";
import {IFoveaCliConfigGenerator} from "./service/generator/fovea-cli-config-generator/i-fovea-cli-config-generator";
import {FoveaCliConfigGenerator} from "./service/generator/fovea-cli-config-generator/fovea-cli-config-generator";
import {IManifestGenerator} from "./service/generator/manifest-generator/i-manifest-generator";
import {ManifestGenerator} from "./service/generator/manifest-generator/manifest-generator";
import {IIndexHtmlGenerator} from "./service/generator/index-html-generator/i-index-html-generator";
import {IndexHtmlGenerator} from "./service/generator/index-html-generator/index-html-generator";
import {IStyleGenerator} from "./service/generator/style-generator/i-style-generator";
import {StyleGenerator} from "./service/generator/style-generator/style-generator";
import {ITemplateGenerator} from "./service/generator/template-generator/i-template-generator";
import {TemplateGenerator} from "./service/generator/template-generator/template-generator";
import {ITsconfigGenerator} from "./service/generator/tsconfig-generator/i-tsconfig-generator";
import {TsconfigGenerator} from "./service/generator/tsconfig-generator/tsconfig-generator";
import {ITslintGenerator} from "./service/generator/tslint-generator/i-tslint-generator";
import {TslintGenerator} from "./service/generator/tslint-generator/tslint-generator";
import {IGitignoreGenerator} from "./service/generator/gitignore-generator/i-gitignore-generator";
import {GitignoreGenerator} from "./service/generator/gitignore-generator/gitignore-generator";
import {INpmignoreGenerator} from "./service/generator/npmignore-generator/i-npmignore-generator";
import {NpmignoreGenerator} from "./service/generator/npmignore-generator/npmignore-generator";
import {IAssetGenerator} from "./service/generator/asset-generator/i-asset-generator";
import {AssetGenerator} from "./service/generator/asset-generator/asset-generator";
import {IDevServerService} from "./service/dev-server/i-dev-server-service";
import {DevServerService} from "./service/dev-server/dev-server-service";
import {RequestHandler} from "./service/dev-server/request-handler/request-handler";
import {IRequestHandler} from "./service/dev-server/request-handler/i-request-handler";
import {IPolyfillService} from "./service/polyfill/i-polyfill-service";
import {PolyfillService} from "./service/polyfill/polyfill-service";
import {Commands} from "./command/commands";
import {IAssetParserService} from "./service/parser/asset-parser/i-asset-parser-service";
import {AssetParserService} from "./service/parser/asset-parser/asset-parser-service";
import {IDiskCacheRegistryService} from "./service/cache-registry/disk-cache-registry/i-disk-cache-registry-service";
import {DiskCacheRegistryService} from "./service/cache-registry/disk-cache-registry/disk-cache-registry-service";
import {compressionAlgorithmOptions, ICompressionAlgorithmOptions} from "./service/compression/compression-algorithm-options";
import {IFileWatcher} from "./service/watch/i-file-watcher";
import {FileWatcher} from "./service/watch/file-watcher";

// Utilities
export const container = new DIContainer();
container.registerSingleton<IProjectPathUtil, ProjectPathUtil>();
container.registerSingleton<IThrottleUtil, ThrottleUtil>();
container.registerSingleton<IPathUtil, PathUtil>();
container.registerSingleton<IFileSaver, FileSaver>();
container.registerSingleton<IFileSaver, FileSaver>();
container.registerSingleton<IFileLoader, FileLoader>();
container.registerSingleton<IFoveaStyles, FoveaStyles>();
container.registerSingleton<IRollupService, RollupService>();
container.registerSingleton<IHasherService, HasherService>();
container.registerSingleton<ILoggerService, LoggerService>();
container.registerSingleton<IFormatter, Formatter>();
container.registerSingleton<IBundlerService, BundlerService>();
container.registerSingleton<ICompressorService, CompressorService>();
container.registerSingleton<IBufferSerializer>(() => new BufferSerializer());
container.registerSingleton<IPolyfillService, PolyfillService>();
container.registerSingleton<IFileWatcher, FileWatcher>();
container.registerSingleton<IDiskCacheRegistryService, DiskCacheRegistryService>();

// Writers
container.registerSingleton<IManifestJsonWriterService, ManifestJsonWriterService>();
container.registerSingleton<IIndexHtmlWriterService, IndexHtmlWriterService>();
container.registerSingleton<IAssetWriterService, AssetWriterService>();

// Optimization
container.registerSingleton<IAssetOptimizerService, AssetOptimizerService>();
container.registerSingleton<IFileTypeDetectorService, FileTypeDetectorService>();

// Image optimizers
container.registerSingleton<ISharpImageOptimizer, SharpImageOptimizer>();
container.registerSingleton<ISvgoImageOptimizer, SvgoImageOptimizer>();
container.registerSingleton<IIcoImageOptimizer, IcoImageOptimizer>();
container.registerSingleton<IImageOptimizer, CombinedImageOptimizer>();

// Script optimizers
container.registerSingleton<IBabelMinifyOptimizer, BabelMinifyOptimizer>();
container.registerSingleton<IScriptOptimizer, CombinedScriptOptimizer>();

// Configuration
container.registerSingleton<IBuildConfig>(() => buildConfig);
container.registerSingleton<IBabelMinifyOptions>(() => babelMinifyOptions);
container.registerSingleton<BrotliEncodeParams>(() => brotliCompressionOptions);
container.registerSingleton<ZlibOptions>(() => zlibCompressionOptions);
container.registerSingleton<ICompressionAlgorithmOptions>(() => compressionAlgorithmOptions);

// Generators
container.registerSingleton<IPackageJsonGenerator, PackageJsonGenerator>();
container.registerSingleton<IEnvironmentGenerator, EnvironmentGenerator>();
container.registerSingleton<IConfigGenerator, ConfigGenerator>();
container.registerSingleton<IFoveaCliConfigGenerator, FoveaCliConfigGenerator>();
container.registerSingleton<IManifestGenerator, ManifestGenerator>();
container.registerSingleton<IIndexHtmlGenerator, IndexHtmlGenerator>();
container.registerSingleton<IStyleGenerator, StyleGenerator>();
container.registerSingleton<ITemplateGenerator, TemplateGenerator>();
container.registerSingleton<ITsconfigGenerator, TsconfigGenerator>();
container.registerSingleton<ITslintGenerator, TslintGenerator>();
container.registerSingleton<IGitignoreGenerator, GitignoreGenerator>();
container.registerSingleton<INpmignoreGenerator, NpmignoreGenerator>();
container.registerSingleton<IAssetGenerator, AssetGenerator>();

// Parsers
container.registerSingleton<IConfigParserService, ConfigParserService>();
container.registerSingleton<IPackageJsonParserService, PackageJsonParserService>();
container.registerSingleton<IStylesParserService, StylesParserService>();
container.registerSingleton<IManifestJsonParserService, ManifestJsonParserService>();
container.registerSingleton<IIndexHtmlParserService, IndexHtmlParserService>();
container.registerSingleton<IProjectParserService, ProjectParserService>();
container.registerSingleton<IAssetParserService, AssetParserService>();

// Normalizers
container.registerSingleton<NormalizeFunction<IEnvironmentDefaults>>(() => environmentDefaultsNormalizeFunction);
container.registerSingleton<NormalizeFunction<ITsconfig>>(() => tsconfigNormalizeFunction);
container.registerSingleton<NormalizeFunction<ITslintConfiguration>>(() => tslintNormalizeFunction);
container.registerSingleton<NormalizeFunction<IFoveaCliConfig, Partial<IFoveaCliConfigWithAppName>>>(() => foveaCliConfigNormalizeFunction);
container.registerSingleton<NormalizeFunction<IGitignore>>(() => gitignoreNormalizeFunction);
container.registerSingleton<NormalizeFunction<INpmignore>>(() => npmignoreNormalizeFunction);
container.registerSingleton<NormalizeFunction<IPackageJson, PackageJsonUserOptions, IPackageJsonNormalizeFunctionConfig>>(() => packageJsonNormalizeFunction);

// Server
container.registerSingleton<IDevServerService, DevServerService>();
container.registerSingleton<IRequestHandler, RequestHandler>();

// Commands
container.registerSingleton<ICommandContainer, CommandContainer>();
container.registerSingleton<ICreateCommand, CreateCommand>();
container.registerSingleton<IBuildCommand, BuildCommand>();
container.registerSingleton<Commands>(() => [
	container.get<ICreateCommand>(),
	container.get<IBuildCommand>()
]);

// Tasks
container.registerTransient<ICreateTask, CreateTask>();
container.registerTransient<IBuildTask, BuildTask>();

// Task wrappers
container.registerSingleton<CreateTaskWrapper>(() => () => container.get<ICreateTask>());
container.registerSingleton<BuildTaskWrapper>(() => () => container.get<IBuildTask>());