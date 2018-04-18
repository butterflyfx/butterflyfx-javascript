import * as $protobuf from "protobufjs";

/** Represents a StyleRunner */
export class StyleRunner extends $protobuf.rpc.Service {

    /**
     * Constructs a new StyleRunner service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new StyleRunner service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): StyleRunner;

    /**
     * Calls SaveStyleReport.
     * @param request StyleReport message or plain object
     * @param callback Node-style callback called with the error, if any, and StyleReport
     */
    public saveStyleReport(request: IStyleReport, callback: StyleRunner.SaveStyleReportCallback): void;

    /**
     * Calls SaveStyleReport.
     * @param request StyleReport message or plain object
     * @returns Promise
     */
    public saveStyleReport(request: IStyleReport): Promise<StyleReport>;

    /**
     * Calls SaveStyleReportScreenshot.
     * @param request StyleReportScreenshot message or plain object
     * @param callback Node-style callback called with the error, if any, and StyleReportScreenshot
     */
    public saveStyleReportScreenshot(request: IStyleReportScreenshot, callback: StyleRunner.SaveStyleReportScreenshotCallback): void;

    /**
     * Calls SaveStyleReportScreenshot.
     * @param request StyleReportScreenshot message or plain object
     * @returns Promise
     */
    public saveStyleReportScreenshot(request: IStyleReportScreenshot): Promise<StyleReportScreenshot>;
}

export namespace StyleRunner {

    /**
     * Callback as used by {@link StyleRunner#saveStyleReport}.
     * @param error Error, if any
     * @param [response] StyleReport
     */
    type SaveStyleReportCallback = (error: (Error|null), response?: StyleReport) => void;

    /**
     * Callback as used by {@link StyleRunner#saveStyleReportScreenshot}.
     * @param error Error, if any
     * @param [response] StyleReportScreenshot
     */
    type SaveStyleReportScreenshotCallback = (error: (Error|null), response?: StyleReportScreenshot) => void;
}

/** Properties of an EventRecording. */
export interface IEventRecording {

    /** EventRecording event */
    event?: (string|null);

    /** EventRecording target */
    target?: (string|null);

    /** EventRecording value */
    value?: (string|null);

    /** EventRecording diff */
    diff?: (string|null);
}

/** Represents an EventRecording. */
export class EventRecording implements IEventRecording {

    /**
     * Constructs a new EventRecording.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEventRecording);

    /** EventRecording event. */
    public event: string;

    /** EventRecording target. */
    public target: string;

    /** EventRecording value. */
    public value: string;

    /** EventRecording diff. */
    public diff: string;

    /**
     * Creates a new EventRecording instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EventRecording instance
     */
    public static create(properties?: IEventRecording): EventRecording;

    /**
     * Encodes the specified EventRecording message. Does not implicitly {@link EventRecording.verify|verify} messages.
     * @param message EventRecording message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEventRecording, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified EventRecording message, length delimited. Does not implicitly {@link EventRecording.verify|verify} messages.
     * @param message EventRecording message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEventRecording, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an EventRecording message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EventRecording
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): EventRecording;

    /**
     * Decodes an EventRecording message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EventRecording
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): EventRecording;

    /**
     * Verifies an EventRecording message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an EventRecording message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EventRecording
     */
    public static fromObject(object: { [k: string]: any }): EventRecording;

    /**
     * Creates a plain object from an EventRecording message. Also converts values to other types if specified.
     * @param message EventRecording
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: EventRecording, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this EventRecording to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TestEnvironment. */
export interface ITestEnvironment {

    /** TestEnvironment id */
    id?: (number|Long|null);

    /** TestEnvironment name */
    name?: (string|null);

    /** TestEnvironment browser */
    browser?: (string|null);

    /** TestEnvironment variables */
    variables?: ({ [k: string]: string }|null);
}

/** Represents a TestEnvironment. */
export class TestEnvironment implements ITestEnvironment {

    /**
     * Constructs a new TestEnvironment.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITestEnvironment);

    /** TestEnvironment id. */
    public id: (number|Long);

    /** TestEnvironment name. */
    public name: string;

    /** TestEnvironment browser. */
    public browser: string;

    /** TestEnvironment variables. */
    public variables: { [k: string]: string };

    /**
     * Creates a new TestEnvironment instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TestEnvironment instance
     */
    public static create(properties?: ITestEnvironment): TestEnvironment;

    /**
     * Encodes the specified TestEnvironment message. Does not implicitly {@link TestEnvironment.verify|verify} messages.
     * @param message TestEnvironment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITestEnvironment, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TestEnvironment message, length delimited. Does not implicitly {@link TestEnvironment.verify|verify} messages.
     * @param message TestEnvironment message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITestEnvironment, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TestEnvironment message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TestEnvironment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TestEnvironment;

    /**
     * Decodes a TestEnvironment message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TestEnvironment
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TestEnvironment;

    /**
     * Verifies a TestEnvironment message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TestEnvironment message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TestEnvironment
     */
    public static fromObject(object: { [k: string]: any }): TestEnvironment;

    /**
     * Creates a plain object from a TestEnvironment message. Also converts values to other types if specified.
     * @param message TestEnvironment
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TestEnvironment, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TestEnvironment to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RenderSession. */
export interface IRenderSession {

    /** RenderSession url */
    url?: (string|null);

    /** RenderSession buildId */
    buildId?: (number|Long|null);

    /** RenderSession revisionId */
    revisionId?: (number|Long|null);

    /** RenderSession uuid */
    uuid?: (string|null);

    /** RenderSession reportId */
    reportId?: (number|Long|null);

    /** RenderSession recording */
    recording?: (IEventRecording[]|null);

    /** RenderSession environment */
    environment?: (ITestEnvironment|null);
}

/** Represents a RenderSession. */
export class RenderSession implements IRenderSession {

    /**
     * Constructs a new RenderSession.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRenderSession);

    /** RenderSession url. */
    public url: string;

    /** RenderSession buildId. */
    public buildId: (number|Long);

    /** RenderSession revisionId. */
    public revisionId: (number|Long);

    /** RenderSession uuid. */
    public uuid: string;

    /** RenderSession reportId. */
    public reportId: (number|Long);

    /** RenderSession recording. */
    public recording: IEventRecording[];

    /** RenderSession environment. */
    public environment?: (ITestEnvironment|null);

    /**
     * Creates a new RenderSession instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RenderSession instance
     */
    public static create(properties?: IRenderSession): RenderSession;

    /**
     * Encodes the specified RenderSession message. Does not implicitly {@link RenderSession.verify|verify} messages.
     * @param message RenderSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRenderSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified RenderSession message, length delimited. Does not implicitly {@link RenderSession.verify|verify} messages.
     * @param message RenderSession message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRenderSession, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a RenderSession message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RenderSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): RenderSession;

    /**
     * Decodes a RenderSession message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RenderSession
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): RenderSession;

    /**
     * Verifies a RenderSession message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RenderSession message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RenderSession
     */
    public static fromObject(object: { [k: string]: any }): RenderSession;

    /**
     * Creates a plain object from a RenderSession message. Also converts values to other types if specified.
     * @param message RenderSession
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RenderSession, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RenderSession to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StyleReport. */
export interface IStyleReport {

    /** StyleReport id */
    id?: (number|Long|null);

    /** StyleReport content */
    content?: (string|null);

    /** StyleReport buildId */
    buildId?: (number|Long|null);

    /** StyleReport revisionId */
    revisionId?: (number|Long|null);

    /** StyleReport expected */
    expected?: (boolean|null);

    /** StyleReport hasDifferences */
    hasDifferences?: (boolean|null);
}

/** Represents a StyleReport. */
export class StyleReport implements IStyleReport {

    /**
     * Constructs a new StyleReport.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStyleReport);

    /** StyleReport id. */
    public id: (number|Long);

    /** StyleReport content. */
    public content: string;

    /** StyleReport buildId. */
    public buildId: (number|Long);

    /** StyleReport revisionId. */
    public revisionId: (number|Long);

    /** StyleReport expected. */
    public expected: boolean;

    /** StyleReport hasDifferences. */
    public hasDifferences: boolean;

    /**
     * Creates a new StyleReport instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StyleReport instance
     */
    public static create(properties?: IStyleReport): StyleReport;

    /**
     * Encodes the specified StyleReport message. Does not implicitly {@link StyleReport.verify|verify} messages.
     * @param message StyleReport message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStyleReport, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StyleReport message, length delimited. Does not implicitly {@link StyleReport.verify|verify} messages.
     * @param message StyleReport message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStyleReport, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StyleReport message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StyleReport
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StyleReport;

    /**
     * Decodes a StyleReport message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StyleReport
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StyleReport;

    /**
     * Verifies a StyleReport message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StyleReport message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StyleReport
     */
    public static fromObject(object: { [k: string]: any }): StyleReport;

    /**
     * Creates a plain object from a StyleReport message. Also converts values to other types if specified.
     * @param message StyleReport
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StyleReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StyleReport to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StyleReportScreenshot. */
export interface IStyleReportScreenshot {

    /** StyleReportScreenshot id */
    id?: (number|Long|null);

    /** StyleReportScreenshot reportId */
    reportId?: (number|Long|null);

    /** StyleReportScreenshot base64Content */
    base64Content?: (string|null);

    /** StyleReportScreenshot browserName */
    browserName?: (string|null);

    /** StyleReportScreenshot browserVersion */
    browserVersion?: (string|null);

    /** StyleReportScreenshot base64ThumbnailContent */
    base64ThumbnailContent?: (string|null);

    /** StyleReportScreenshot stepIndex */
    stepIndex?: (number|Long|null);
}

/** Represents a StyleReportScreenshot. */
export class StyleReportScreenshot implements IStyleReportScreenshot {

    /**
     * Constructs a new StyleReportScreenshot.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStyleReportScreenshot);

    /** StyleReportScreenshot id. */
    public id: (number|Long);

    /** StyleReportScreenshot reportId. */
    public reportId: (number|Long);

    /** StyleReportScreenshot base64Content. */
    public base64Content: string;

    /** StyleReportScreenshot browserName. */
    public browserName: string;

    /** StyleReportScreenshot browserVersion. */
    public browserVersion: string;

    /** StyleReportScreenshot base64ThumbnailContent. */
    public base64ThumbnailContent: string;

    /** StyleReportScreenshot stepIndex. */
    public stepIndex: (number|Long);

    /**
     * Creates a new StyleReportScreenshot instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StyleReportScreenshot instance
     */
    public static create(properties?: IStyleReportScreenshot): StyleReportScreenshot;

    /**
     * Encodes the specified StyleReportScreenshot message. Does not implicitly {@link StyleReportScreenshot.verify|verify} messages.
     * @param message StyleReportScreenshot message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStyleReportScreenshot, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StyleReportScreenshot message, length delimited. Does not implicitly {@link StyleReportScreenshot.verify|verify} messages.
     * @param message StyleReportScreenshot message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStyleReportScreenshot, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StyleReportScreenshot message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StyleReportScreenshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StyleReportScreenshot;

    /**
     * Decodes a StyleReportScreenshot message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StyleReportScreenshot
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StyleReportScreenshot;

    /**
     * Verifies a StyleReportScreenshot message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StyleReportScreenshot message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StyleReportScreenshot
     */
    public static fromObject(object: { [k: string]: any }): StyleReportScreenshot;

    /**
     * Creates a plain object from a StyleReportScreenshot message. Also converts values to other types if specified.
     * @param message StyleReportScreenshot
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StyleReportScreenshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StyleReportScreenshot to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
