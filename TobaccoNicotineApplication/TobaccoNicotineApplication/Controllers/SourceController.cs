﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;
using TobaccoNicotineApplication.Utilities;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize]
    [NoCache]
    [ValidateAntiForgeryTokenOnAllPosts]
    public class SourceController : Controller
    {
        //
        // GET: /Source/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Source/GetSourceList
        [HttpPost]
        public JsonResult GetSourceList(string[] sourceName, string[] link, string[] repository, DateTime[] dateSource, string[] username, 
            string orderSourceName, string orderLink, string orderRepository, string orderDateDownload, string orderUsername)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Source> sources = from s in db.Sources
                                             select s;

                if (ArrayUtils.IsNullOrEmpty(sourceName) == false)
                    sources = sources.Where(t => sourceName.Contains(t.Name));

                if (ArrayUtils.IsNullOrEmpty(link) == false)
                    sources = sources.Where(t => link.Contains(t.Link));

                if (ArrayUtils.IsNullOrEmpty(repository) == false)
                    sources = sources.Where(t => repository.Contains(t.Repository));

                if (ArrayUtils.IsNullOrEmpty(dateSource) == false)
                    sources = sources.Where(t => dateSource.Contains(t.DateDownload.Value));

                if (ArrayUtils.IsNullOrEmpty(username) == false)
                    sources = sources.Where(t => username.Contains(t.Username));

                if (orderSourceName == "desc")
                    sources = sources.OrderByDescending(x => x.Name);
                else if (orderSourceName == "asc")
                    sources = sources.OrderBy(x => x.Name);

                if (orderLink == "desc")
                    sources = sources.OrderByDescending(x => x.Link);
                else if (orderLink == "asc")
                    sources = sources.OrderBy(x => x.Link);

                if (orderRepository == "desc")
                    sources = sources.OrderByDescending(x => x.Repository);
                else if (orderRepository == "asc")
                    sources = sources.OrderBy(x => x.Repository);

                if (orderDateDownload == "desc")
                    sources = sources.OrderByDescending(x => x.DateDownload);
                else if (orderDateDownload == "asc")
                    sources = sources.OrderBy(x => x.DateDownload);

                if (orderUsername == "desc")
                    sources = sources.OrderByDescending(x => x.Username);
                else if (orderUsername == "asc")
                    sources = sources.OrderBy(x => x.Username);

                return Json(sources.Select(x => new { x.Name, x.Date, x.Time, x.Link, x.Repository, x.DateDownload, x.Username }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(string SourceName, DateTime date, TimeSpan time, string link, string repository, string dateDownload, string username)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Source model = db.Sources.Where(x => x.Name == SourceName && x.Date == date && x.Time == time).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(link))
                        if (link == "null")
                            model.Link = null;
                        else
                            model.Link = link;
                    if (!String.IsNullOrEmpty(repository))
                        if (repository == "null")
                            model.Repository = null;
                        else
                            model.Repository = repository;
                    if (!String.IsNullOrEmpty(dateDownload))
                        if (dateDownload == "null")
                            model.DateDownload = null;
                        else
                            model.DateDownload = DateTime.Parse(dateDownload);
                    if (!String.IsNullOrEmpty(username))
                            model.Username = username;

                    if (!String.IsNullOrEmpty(link) || !String.IsNullOrEmpty(repository) || !String.IsNullOrEmpty(dateDownload) || !String.IsNullOrEmpty(username))
                        status = true;

                    // solo se è stato modificato qualcosa salvo
                    if (status == true)
                    {
                        db.Entry(model).State = EntityState.Modified;

                        db.SaveChanges();
                    } // if
                }
                else
                {
                    return Json(new { success = false, error = "Source not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(string sourceName, DateTime date, TimeSpan time)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Source source = db.Sources.Where(x => x.Name == sourceName && x.Date == date && x.Time == time).FirstOrDefault();
                if (source != null)
                {
                    db.Sources.Remove(source);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Source source, short countryCode, short number, short year)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                // check duplicate
                bool result = db.Sources.Any(x => x.Name == source.Name && x.Date == source.Date && x.Time == source.Time);
                if (result == true)
                {
                    ModelState.AddModelError("Name", StaticName.SourceName() + " is already present.");
                    ModelState.AddModelError("Date", StaticName.UploadDate() + " is already present.");
                    ModelState.AddModelError("Time", StaticName.UploadTime() + " is already present.");
                }

                if (ModelState.IsValid)
                {
                    db.Sources.Add(source);

                    db.SaveChanges();

                    status = true;
                }
                else
                {
                    IEnumerable<string> errorModel =
                        from x in ModelState.Keys
                        where ModelState[x].Errors.Count > 0
                        select x;

                    return Json(new { success = status, errors = errorModel.Select(x => new { key = x, errors = ModelState[x].Errors.Select(y => y.ErrorMessage).ToArray() }) }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status });
            }
        }

        //
        // POST: /Source/GetFieldList
        [HttpPost]
        public JsonResult GetFieldList(string[] name, string[] link, string[] repository, DateTime[] dateSource, string[] username)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Source> sources = from s in db.Sources
                                             select s;

                if (ArrayUtils.IsNullOrEmpty(name) == false)
                    sources = sources.Where(t => name.Contains(t.Name));

                if (ArrayUtils.IsNullOrEmpty(link) == false)
                    sources = sources.Where(t => link.Contains(t.Link));

                if (ArrayUtils.IsNullOrEmpty(repository) == false)
                    sources = sources.Where(t => repository.Contains(t.Repository));

                if (ArrayUtils.IsNullOrEmpty(dateSource) == false)
                    sources = sources.Where(t => dateSource.Contains(t.DateDownload.Value));

                if (ArrayUtils.IsNullOrEmpty(username) == false)
                    sources = sources.Where(t => username.Contains(t.Username));

                return Json(sources.Select(x => new { x.Name, x.Link, x.Repository, x.DateDownload, x.Username }).GroupBy(li => li.Name).Select(x => x.FirstOrDefault()).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/LoadSource
        [HttpPost]
        public JsonResult LoadSource(HttpPostedFileBase file)
        {
            string path = Server.MapPath("~/Uploads");
            try
            {
                string message = "File uploaded.";
                bool status = true;
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Configuration.ProxyCreationEnabled = false;

                    // divido il file in due parti
                    string[] slitFileNames = file.FileName.Split('_');
                    if (slitFileNames.Length > 0)
                    {
                        // converto la prima parte che dovrebbe essere un numero
                        int number = int.Parse(slitFileNames[0]);
                        Value value = db.Values.Where(x => x.NomismaCode == short.Parse(slitFileNames[0])).FirstOrDefault();

                        // controllo che il valore esista
                        if (value != null)
                        {
                            db.Entry(value).Collection(i => i.Sources).Load();

                            Source source = value.Sources.FirstOrDefault();
                            if (source != null)
                            {
                                string filePath = source.Name + "-" + source.Date.Day + "-" + source.Date.Month + "-" + source.Date.Year + "-" + source.Time.Hours + "-" + source.Time.Minutes + "-" + source.Time.Seconds;

                                // vedo se esiste già il file
                                if (System.IO.File.Exists(path + "/Sources" + "/" + filePath + "/" + source.Repository))
                                    return Json(new { success = false, response = "File already exists.", filePath }, JsonRequestBehavior.AllowGet);

                                // creo l'eventuale cartella della fonte
                                if (!Directory.Exists(path + "/Sources" + "/" + filePath))
                                {
                                    Directory.CreateDirectory(path + "/Sources" + "/" + filePath);
                                }

                                // aggiorno il nomeFile
                                source.Repository = file.FileName;

                                // carico file
                                file.SaveAs(filePath);

                                db.Entry(source).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                            else
                            {
                                status = false;
                                message += file.FileName + ": source not found.";
                            }
                        }
                        else
                        {
                            status = false;
                            message = file.FileName + ": value not found.";
                        }
                    } // if split
                    else
                    {
                        status = false;
                        message = file.FileName + ": name isn't correct.";
                    }

                    return Json(new { success = status, response = message }, JsonRequestBehavior.AllowGet);
                } // using db
            }
            catch (Exception exception)
            {
                return Json(new { success = false, response = exception.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/DeleteFile
        [HttpPost]
        public JsonResult DeleteFile(string filePath)
        {
            string path = Server.MapPath("~/Uploads");
            try
            {
                System.IO.File.Delete(path + "/Sources" + "/" + filePath);

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }

    }
}