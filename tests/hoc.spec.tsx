import { TestStore } from "./common";
import React from "react";
import { mount } from "enzyme";
import withStores, { WithStoresProps } from "../src/withStores";
import StoreProvider from "../src/StoreProvider";

interface Props extends WithStoresProps {

}

describe("HOC", () => {

  const Component = withStores(({ useStore }: Props) => {
    const store = useStore(TestStore);
    return (
      <span>{store.state.value}</span>
    );
  });

  it("should render with current store state", () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");

  });

  it("should update the number after setState", async () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");

    await store.increment();

    expect(wrapper.find("span").text()).toBe("43");

    await store.setState(({ value }) => ({ value: value + 1 }));

    expect(wrapper.find("span").text()).toBe("44");

  });

  it("should add a listener when mounted and remove one when unmounted", () => {

    const store = new TestStore(42);

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(0);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(1);

    wrapper.unmount();

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(0);

  });

  it("should report error when using a store that is not provided", () => {

    expect(() => mount(
      <StoreProvider stores={[]}>
        <Component />
      </StoreProvider>,
    )).toThrowError();
  });

  it("should report error with no StoreProvider", () => {
    expect(() => mount(<Component />)).toThrowError();
  });

});
