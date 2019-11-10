using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
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
    public class VariableController : Controller
    {
        //
        // GET: /Variable/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Variable/GetVariableList
        [HttpPost]
        public JsonResult GetVariableList(short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc, string[] measurementUnit, string orderName, string orderPhaseCode, string orderPhaseName, string orderVarLc, string orderUnitName)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Variable> variables = from s in db.Variables
                                                  select s;

                if (ArrayUtils.IsNullOrEmpty(number) == false)
                    variables = variables.Where(t => number.Contains(t.Number));

                if (ArrayUtils.IsNullOrEmpty(variableName) == false)
                    variables = variables.Where(t => variableName.Contains(t.Name));

                if (ArrayUtils.IsNullOrEmpty(phaseCode) == false)
                    variables = variables.Where(t => phaseCode.Contains(t.PhaseCode));

                if (ArrayUtils.IsNullOrEmpty(phaseName) == false)
                    variables = variables.Where(t => phaseName.Contains(t.PhaseName));

                if (ArrayUtils.IsNullOrEmpty(varLc) == false)
                    variables = variables.Where(t => varLc.Contains(t.VarLc));

                if (ArrayUtils.IsNullOrEmpty(measurementUnit) == false)
                    variables = variables.Where(t => measurementUnit.Contains(t.MeasurementUnitName));

                if (orderName == "desc")
                    variables = variables.OrderByDescending(x => x.Name);
                else if (orderName == "asc")
                    variables = variables.OrderBy(x => x.Name);

                if (orderPhaseCode == "desc")
                    variables = variables.OrderByDescending(x => x.PhaseCode);
                else if (orderPhaseCode == "asc")
                    variables = variables.OrderBy(x => x.PhaseCode);

                if (orderPhaseName == "desc")
                    variables = variables.OrderByDescending(x => x.PhaseName);
                else if (orderPhaseName == "asc")
                    variables = variables.OrderBy(x => x.PhaseName);

                if (orderVarLc == "desc")
                    variables = variables.OrderByDescending(x => x.VarLc);
                else if (orderVarLc == "asc")
                    variables = variables.OrderBy(x => x.VarLc);

                if (orderUnitName == "desc")
                    variables = variables.OrderByDescending(x => x.MeasurementUnitName);
                else if (orderUnitName == "asc")
                    variables = variables.OrderBy(x => x.MeasurementUnitName);

                return Json(variables.Select(x => new { x.Number, x.Name, x.PhaseCode, x.PhaseName, x.VarLc, x.MeasurementUnitName }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Variable/GetListVariableName
        public JsonResult GetListVariableName()
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                return Json(db.Variables.Select(x => new { x.Name, x.Number }).OrderBy(x => x.Number).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Variable/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(short number, string name, short? phaseCode, string phaseName, bool? varLc, string unit)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Variable model = db.Variables.Where(x => x.Number == number).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(name))
                        model.Name = name;
                    if (phaseCode.HasValue)
                        model.PhaseCode = phaseCode.Value;
                    if (!String.IsNullOrEmpty(phaseName))
                        model.PhaseName = phaseName;
                    if (varLc.HasValue)
                        model.VarLc = varLc.Value;
                    if (!String.IsNullOrEmpty(unit))
                        model.MeasurementUnitName = unit;

                    if (!String.IsNullOrEmpty(name) || phaseCode.HasValue || !String.IsNullOrEmpty(phaseName) || varLc.HasValue || !String.IsNullOrEmpty(unit))
                        status = true;

                    // solo se è stato modificato qualcosa salvo
                    if (status == true)
                    {
                        db.Entry(model).State = EntityState.Modified;

                        try
                        {
                            db.SaveChanges();
                        }
                        catch (DbUpdateException e)
                        {
                            SqlException innerException = null;
                            Exception tmp = e;
                            while (innerException == null && tmp != null)
                            {
                                if (tmp != null)
                                {
                                    innerException = tmp.InnerException as SqlException;
                                    tmp = tmp.InnerException;
                                }

                            }
                            if (innerException != null && innerException.Number == 2601)
                            {
                                // UNIQUE
                                return Json(new { success = false, error = StaticName.VariableName() + " is already present." }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                throw;
                            }
                        }
                    } // if
                }
                else
                {
                    return Json(new { success = false, error = "Variable not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Variable/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(short number)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Variable variable = db.Variables.Where(a => a.Number == number).FirstOrDefault();
                if (variable != null)
                {
                    db.Variables.Remove(variable);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Variable/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Variable variable)
        {
            bool status = false;
            if (ModelState.IsValid)
            {
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Variables.Add(variable);

                    try
                    {
                        db.SaveChanges();
                    }
                    // catch dovuti ai vincoli del db
                    catch (DbUpdateException e)
                    {
                        SqlException innerException = null;
                        Exception tmp = e;
                        while (innerException == null && tmp != null)
                        {
                            if (tmp != null)
                            {
                                innerException = tmp.InnerException as SqlException;
                                tmp = tmp.InnerException;
                            }

                        }
                        if (innerException != null && innerException.Number == 2601)
                        {
                            // UNIQUE
                            string[] error = { StaticName.VariableName() + " is already present." };
                            string[] keys = { "Name" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else if (innerException != null && innerException.Number == 2627)
                        {
                            // PK
                            string[] error = { StaticName.Number() + " is already present." };
                            string[] keys = { "Number" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            throw;
                        }
                    }
                    // catch dovuti alle annotazioni
                    catch (DbEntityValidationException e)
                    {
                        foreach (var error in e.EntityValidationErrors.SelectMany(entity => entity.ValidationErrors))
                        {
                            //error.PropertyName
                            return Json(new { success = false, error = error.ErrorMessage + "." }, JsonRequestBehavior.AllowGet);
                        }
                    }

                    status = true;

                    return Json(new { success = status }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                // errori dovuti check delle annotazioni
                IEnumerable<string> errorModel =
                    from x in ModelState.Keys
                    where ModelState[x].Errors.Count > 0
                    select x;

                return Json(new { success = status, errors = errorModel.Select(x => new { key = x, errors = ModelState[x].Errors.Select(y => y.ErrorMessage).ToArray() }) }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Variable/GetFieldList
        [HttpPost]
        public JsonResult GetFieldList(short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc, string[] measurementUnit)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Variable> variables = from s in db.Variables
                                                  select s;

                if (ArrayUtils.IsNullOrEmpty(number) == false)
                    variables = variables.Where(t => number.Contains(t.Number));

                if (ArrayUtils.IsNullOrEmpty(variableName) == false)
                    variables = variables.Where(t => variableName.Contains(t.Name));

                if (ArrayUtils.IsNullOrEmpty(phaseCode) == false)
                    variables = variables.Where(t => phaseCode.Contains(t.PhaseCode));

                if (ArrayUtils.IsNullOrEmpty(phaseName) == false)
                    variables = variables.Where(t => phaseName.Contains(t.PhaseName));

                if (ArrayUtils.IsNullOrEmpty(varLc) == false)
                    variables = variables.Where(t => varLc.Contains(t.VarLc));

                if (ArrayUtils.IsNullOrEmpty(measurementUnit) == false)
                    variables = variables.Where(t => measurementUnit.Contains(t.MeasurementUnitName));

                return Json(variables.Select(x => new { x.Number, x.Name, x.PhaseCode, x.PhaseName, x.VarLc, x.MeasurementUnitName }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

    }
}