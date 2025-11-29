"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash } from "lucide-react";
import z from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { relaxedAnalysisRequestSchema } from "@/hooks/useValidations";
import useAnalysisRequest from "@/hooks/useAnalysisRequest";
import useResizer from "@/hooks/useResizer";
import SidebarNavbar from "@/components/dashboard/SidebarNavbar";
import AnalysisResults from "../../components/dashboard/AnalysisResults";
import { ControllerRenderPropsGeneric } from "@/redux/slices/analysisSlice";
import { Textarea } from "@/components/ui/textarea";


type FormData = z.infer<typeof relaxedAnalysisRequestSchema>;
const Page = (): React.ReactElement => {
  // ** Active tab tracking ** \\
  const [activeTab, setActiveTab] = useState<string>("query-params");

  // ** Custom hook to aid both validation and api response handling ** \\
  const {
    isLoading,
    createEffect,
    isError,
    error,
    failedAnalysisUi,
    isSuccess
  } = useAnalysisRequest()

  // ** Analyisis request form ** \\
  const analysisRequestForm = useForm<FormData>({
    resolver: zodResolver(relaxedAnalysisRequestSchema),
    defaultValues: {
      method: "GET",
      endpoint: "",
      body: "",
      headers: [{ key: "", value: "" }],
      queryParams: [{ key: "", value: "" }],
    },
  });

  // ** Useful tools ** \\
  const {
    watch,
    setValue,
    control,
  } = analysisRequestForm;

  // ** Function to add a key, value pair from headers or queryParams array ** \\
  const addKeyValuePair = (type: "headers" | "queryParams") => {
    const current = watch(type);
    // if (current.length >= 15) return;
    setValue(type, [...current, { key: "", value: "" }], {
      shouldValidate: true,
    });
  };

  // ** Function to remove a key, value pair from headers or queryParams array ** \\
  const removeKeyValuePair = (type: "headers" | "queryParams", index: number) => {
    const current = watch(type);
    const newArray = current.filter((_, i) => i !== index);
    setValue(type, newArray, { shouldValidate: true });
  };

  // ** Watched headers and queryParams ** \\
  const watchedHeaders = watch("headers");
  const watchedQueryParams = watch("queryParams");

  // ** Function to render key value pairs ** \\
  const renderKeyValuePairs = (type: "headers" | "queryParams") => {
    const getKeyValuePair = (
      fieldName: "queryParams" | "headers",
    ) => {
      // ** Adds a new key value pair when a change has been sensed in key or value field ** \\
      /**
       * @param {React.ChangeEvent<HTMLInputElement>} e 
       * @param {ControllerRenderProps<ControllerRenderPropsGeneric>} field 
       * @param {number} index 
       * @returns {void}
       */
      const onChangeFunc = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: ControllerRenderProps<ControllerRenderPropsGeneric>,
        index: number
      ): void => {
        field.onChange(e.target.value);
        const currentWatchedArray = fieldName === "queryParams" ? watchedQueryParams : watchedHeaders;
        const isLastItem = index === currentWatchedArray.length - 1;
        const hasContent = e.target.value.trim() !== "";

        // ** Check if all current fields have content using the correct array ** \\
        const allFieldsHaveContent = currentWatchedArray.every(param =>
          (param.key || "").trim() !== "" || (param.value || "").trim() !== ""
        );

        if (isLastItem && hasContent && allFieldsHaveContent) {
          if (fieldName === "queryParams") addKeyValuePair("queryParams");
          if (fieldName === "headers") addKeyValuePair("headers");
        }
      };

      return (
        (fieldName === "queryParams" ? watchedQueryParams : watchedHeaders).map((_, index) => {
          const currentWatchedArray = fieldName === "queryParams" ? watchedQueryParams : watchedHeaders;
          return (
            <div
              key={index}
              className="hover:bg-muted/40 rounded-lg flex items-center justify-between group gap-2 p-[3.5px] transition-all duration-200"
            >
              <div className="flex items-center flex-1">
                <FormField
                  control={control}
                  name={`${fieldName}.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => onChangeFunc(e, field, index)}
                          placeholder="Key"
                          className="focus-visible:ring-1 focus-visible:ring-primary border-0 border-transparent w-50 text-xs md:text-xs rounded-lg h-9"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`${fieldName}.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => onChangeFunc(e, field, index)}
                          placeholder="Value"
                          className="focus-visible:ring-1 focus-visible:ring-primary border-0 border-transparent flex-1 text-xs md:text-xs rounded-lg h-9"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {currentWatchedArray.length > 1 ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (currentWatchedArray.length > 1) {
                      if (fieldName === "queryParams") removeKeyValuePair("queryParams", index);
                      if (fieldName === "headers") removeKeyValuePair("headers", index);
                    }
                  }}
                  className="cursor-pointer hover:bg-muted/70 w-7 h-7 opacity-1 group-hover:opacity-100"
                >
                  <Trash className="size-3" />
                </Button>
              ) : null}
            </div>
          );
        })
      );
    };

    // ** Headers ** \\
    if (type === "headers" && watchedHeaders.length > 0) {
      return getKeyValuePair("headers");
    };


    // ** Query Params ** \\
    if (type === "queryParams" && watchedQueryParams.length > 0) {
      return getKeyValuePair("queryParams")
    }
  };

  // ** Custom hook to help for getting certain screen sizes ** \\
  const { isDesiredScreen } = useResizer(640);

  const renderTabsTrigger = () => {
    const tabListClasses = `data-[state=active]:bg-muted/50 data-[state=active]:text-white text-foreground/75 flex-1 xs:flex-none text-xs px-2`
    const tabsTriggers = [
      {
        id: 1,
        value: "query-params",
        name: "Query Params",
        extraDetail: watchedQueryParams.length,
      },
      {
        id: 2,
        value: "headers",
        name: "Headers",
        extraDetail: watchedHeaders.length
      },
      {
        id: 3,
        value: "body",
        name: "Body"
      },
    ]

    return (
      tabsTriggers.map((tabTrigger) => (
        <TabsTrigger
          key={tabTrigger.id}
          value={tabTrigger.value}
          className={tabListClasses}
        >
          {tabTrigger.name}{" "}{tabTrigger.extraDetail && tabTrigger.extraDetail > 1 ? tabTrigger.extraDetail : null}
        </TabsTrigger>
      ))
    )
  };
  return (
    <Form {...analysisRequestForm}>
      <form
        onSubmit={analysisRequestForm.handleSubmit(createEffect)}
        className="flex-1 flex flex-col h-full bg-background overflow-x-hidden
        justify-between gap-2 pt-4"
      >
        {/* Navbar */}
        <SidebarNavbar />

        {/* Request header */}
        <header className="px-4">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border
          hover:bg-muted/10 group">
            {/* Method Select */}
            <FormField
              control={control}
              name="method"
              render={({ field }) => (
                <FormItem className="shrink-0">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[100px] bg-transparent border-transparent text-sm tracking-tight
                      hover:bg-muted/30">
                        <SelectValue placeholder="GET" />
                      </SelectTrigger>
                      <SelectContent>
                        {["GET", "POST", "PUT", "PATCH", "DELETE"].map(
                          (method) => (
                            <SelectItem disabled={isLoading} value={method} key={method} className="text-sm">
                              {method}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* URL Input */}
            <FormField
              control={control}
              name="endpoint"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-0">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="w-full border-0 text-sm focus-visible:ring-transparent focus-visible:ring-0
                      bg-transparent"
                      type="text"
                      placeholder={isDesiredScreen ? "URL" : "https://api.example.com/endpoint"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Send Button */}
            <Button
              disabled={isLoading}
              size="sm"
              type="submit"
              className="shrink-0 bg-primary hover:bg-primary/80 text-primary-foreground cursor-pointer"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row px-4">
          {/* Left Panel - Request Configuration */}
          <div className="flex-1 lg:flex-none element-scrollable-hidden-scrollbar
           bg-muted/10 xl:w-[600px] p-2 border-l border-t border-b border-border rounded-t-xl lg:rounded-l-xl lg:rounded-r-none
           max-h-[810px]">
            {/* Request Configuration Tabs */}
            <div className="flex flex-col h-full">
              <Tabs
                value={activeTab}
                defaultValue="query-params"
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col "
              >
                {/* Tabs list */}
                <TabsList className="bg-transparent p-1">
                  {renderTabsTrigger()}
                </TabsList>

                {/* Tab Content */}
                <div className="flex-1">
                  {/* Fixed: Changed "params" to "query-params" */}
                  <TabsContent value="query-params" className="h-full flex-1">
                    {renderKeyValuePairs("queryParams")}
                  </TabsContent>

                  <TabsContent value="headers" className="flex-1 h-full">
                    {renderKeyValuePairs("headers")}
                  </TabsContent>

                  <TabsContent value="body" className="h-full flex-1">
                    <FormField
                      control={control}
                      name="body"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter JSON body..."
                              className="flex-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Analysis Results */}
          <AnalysisResults
            isLoading={isLoading}
            isError={isError}
            error={error}
            failedAnalysisUi={failedAnalysisUi}
            isSuccess={isSuccess}
          />
        </main>
      </form>
    </Form>
  );
};

export default Page;