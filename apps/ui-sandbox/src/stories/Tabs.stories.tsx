"use client";
import { Section, Story } from "~/components";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsRoot,
} from "@valence-ui/ui-components";

const Tabs = () => {
  return (
    <Section id="tabs">
      <Story>
        <TabsRoot defaultValue={TabOptions.Tab1}>
          <TabsList className="">
            <TabsTrigger value={TabOptions.Tab1}>Tab 1</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab2}>Tab 2</TabsTrigger>
            <TabsTrigger value={TabOptions.Tab3}>Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value={TabOptions.Tab1}></TabsContent>
          <TabsContent value={TabOptions.Tab1}>Tab 1 Content</TabsContent>
          <TabsContent value={TabOptions.Tab2}>Tab 2 Content</TabsContent>
          <TabsContent value={TabOptions.Tab3}>Tab 3 Content</TabsContent>
        </TabsRoot>
      </Story>
    </Section>
  );
};

enum TabOptions {
  Tab1 = "tab1",
  Tab2 = "tab2",
  Tab3 = "tab",
}

export default Tabs;
