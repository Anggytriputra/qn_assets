import { Fragment, useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  Bars3BottomLeftIcon,
  BellIcon,
  HomeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  ChartBarIcon,
  PlusIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TruckIcon,
} from "@heroicons/react/20/solid";
import logo from "../assets/logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userSlice";
import { fetchAssetByname } from "../reducers/assetSlice";
import ModalForm, { Modal } from "./Modal";
import ReqFormControl from "./ReqFormControl";
import { fetchCategories } from "../reducers/categorySlice";
import { requestAsset } from "../reducers/transReqOrderSlice";

const navigation = [
  // { name: "Home", path: "/home", icon: HomeIcon },
  // { name: "Dashboard", path: "/dashboard", icon: AcademicCapIcon },
  {
    name: "Asset & Tools",
    icon: TruckIcon,
    subNavigation: [
      { name: "Assets", path: "/asset-tools/data-assets" },
      { name: "Transfer Assets", path: "/asset-tools/transfer-assets" },
      { name: "Return Assets", path: "/asset-tools/return-assets" },
    ],
  },
  // { name: "Team", path: "/team", icon: UsersIcon },
  {
    name: "Settings",
    icon: WrenchScrewdriverIcon,
    subNavigation: [
      { name: "Asset", path: "/settings/asset-name" },
      { name: "Jenis Asset", path: "/setting/jenis-asset" },
      { name: "Role Access", path: "/setting/role-access" },
    ],
  },
  // { name: "Reports", path: "/report", icon: ChartBarIcon },
];

const userNavigation = [
  { name: "Your Profile" },
  // { name: "Settings", href: "#" },
  {
    name: "Sign out",
    //  href: "#"
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SideBar({ element, handleOpenModal }) {
  const CategoryGlobal = useSelector((state) => state.category);
  const userGlobal = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState();
  // console.log("select nih", selectedCategory);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentPath = useLocation().pathname;

  const categoryId = selectedCategory ? selectedCategory.value : null;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [openModal]);

  function handleLogOut() {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleSearchByName(e) {
    e.preventDefault();
    dispatch(fetchAssetByname(searchValue));
    // console.log("search value2", searchValue);
    navigate("/asset-tools/search");
  }

  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleReqAsset(e) {
    // console.log("eeee", e);

    e.preventDefault();
    const name = e.target.assetName.value;
    const quantity = e.target.qty.value;
    const desc = e.target.desc.value;

    // console.log("ctgr ya adalah", desc);
    dispatch(
      requestAsset({
        name: name,
        qty: quantity,
        desc: desc,
        userId: userGlobal.id,
        branchName: userGlobal.cabang_name,
        categoryId: categoryId,
      })
    );
    // setOpenAddModal(false);
  }

  return (
    <>
      <div>
        <Transition.Root
          show={sidebarOpen}
          as={Fragment}
        >
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src={logo}
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 flex flex-1 flex-col">
                    <nav className="flex-1 space-y-1 px-2 pb-4">
                      {navigation.map((item) => (
                        <Disclosure
                          as="div"
                          key={item.name}
                        >
                          {({ open }) => (
                            <>
                              {item.name === "Settings" &&
                              userGlobal.role !== "Super Admin" ? (
                                false
                              ) : (
                                <Disclosure.Button className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-600">
                                  <item.icon
                                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  <ChevronDownIcon
                                    className={classNames(
                                      open
                                        ? "text-indigo-200 rotate-180"
                                        : "text-indigo-300",
                                      "ml-auto h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </Disclosure.Button>
                              )}
                              <Disclosure.Panel className="space-y-1">
                                {item.subNavigation &&
                                  item.subNavigation.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div
                className="w-14 flex-shrink-0"
                aria-hidden="true"
              >
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-700 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src={logo}
                alt="Your Company"
              />
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                <Link
                  to="/home"
                  className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <HomeIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <AcademicCapIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Dashboard
                </Link>

                {/* <Link
                  to="/request-asset"
                  className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <FolderPlusIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Request Asset
                </Link> */}
                {/* Sisipkan tautan menu utama lainnya jika diperlukan */}

                {navigation.map((item) => (
                  <Disclosure
                    as="div"
                    key={item.name}
                  >
                    {({ open }) => (
                      <>
                        {item.name === "Settings" &&
                        userGlobal.role !== "Super Admin" ? (
                          false
                        ) : (
                          <Disclosure.Button className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-600">
                            <item.icon
                              className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                              aria-hidden="true"
                            />
                            {item.name}
                            <ChevronDownIcon
                              className={classNames(
                                open
                                  ? "text-indigo-200 rotate-180"
                                  : "text-indigo-300",
                                "ml-auto h-5 w-5 transform"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                        )}
                        <Disclosure.Panel className="space-y-1">
                          {item.subNavigation &&
                            item.subNavigation.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-4 py-2 text-sm font-medium rounded-md"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </nav>
              {/* <div className="mb-40 items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100">
                <button
                  onClick={handleOpenModal}
                  className="text-indigo-100 hover:bg-slate-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md mt-auto"
                >
                  <PlusIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Request Asset
                </button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon
                className="h-6 w-6"
                aria-hidden="true"
              />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                {/* disini seacrh */}
                <form
                  className="flex w-full md:ml-0"
                  onSubmit={handleSearchByName}
                >
                  <label
                    htmlFor="search-field"
                    className="sr-only"
                  >
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search by name"
                      type="search"
                      name="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu
                  as="div"
                  className="relative ml-3"
                >
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={
                                item.name === "Sign out" ? handleLogOut : null
                              }
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1">
            <div className="py-6 ">
              <div className="w-[90%] sm:w-full mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="pb-4 min-h-screen">
                  {/* <ModalForm
                    openModal
                    title="Asset"
                    open={openModal}
                    setOpen={setOpenModal}
                    action="request"
                    onSubmit={handleReqAsset}
                    children={
                      <ReqFormControl
                        category={CategoryGlobal.categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                      />
                    }
                  /> */}
                  {element}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
